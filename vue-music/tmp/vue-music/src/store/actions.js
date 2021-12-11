import * as types from './mutation-type'
import {instance} from '../api/myAxios'
import {saveSearch,deleteSearch,clearSearch,savePlay,loadPlay} from '@common/js/cache.js'

export const selectPlay=async function({commit,state},{list,index}){
    let ids=list.map(value=>value.id).join(',')
    await instance.get('/song/detail',{params:{'ids':ids}}).then(({data})=>{list=data.songs})
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAYLIST,list)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_PLAYING_STATE,true)
    commit(types.SET_FULL_SCREEN,true)
}

export const insertSong=async function({commit,state},song){
    let playlist=state.playlist
    let currentIndex=state.currentIndex
    let newSong
   
    await instance.get('/song/detail',{params:{'ids':song.id}}).then(({data})=>{newSong=data.songs[0]})
    if(isNaN(currentIndex)){
        playlist.push(newSong)
        currentIndex=0
        console.log(playlist)
        commit(types.SET_SEQUENCE_LIST,playlist)
        commit(types.SET_PLAYLIST,playlist)
        commit(types.SET_CURRENT_INDEX,currentIndex)
        commit(types.SET_PLAYING_STATE,true)
        commit(types.SET_FULL_SCREEN,true)
        return
    }
     

    // let currentSong=playlist[currentIndex]
    let fpIndex=playlist.findIndex((item,index)=>{ return item.id==newSong.id})
    currentIndex++
    playlist.splice(currentIndex,0,newSong)
    if(fpIndex>-1){
        if(currentIndex>fpIndex){
            playlist.splice(fpIndex,1)
            currentIndex--
        }else{
            playlist.splice(fpIndex+1,1)
        }
    }
    commit(types.SET_SEQUENCE_LIST,playlist)
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_PLAYING_STATE,true)
    commit(types.SET_FULL_SCREEN,true)
}

export const saveSearchHistory=function({commit,state},query){
    commit(types.SET_SEARCH_HISTORY,saveSearch(query)) 
}

export const deleteSearchHistory=function({commit,state},query){
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query)) 
}

export const clearSearchHistory=function({commit,state}){
    commit(types.SET_SEARCH_HISTORY,clearSearch()) 
}

export const playRandom=function({commit,state}){
  let length=state.playlist.length
  if(length>0){
    commit(types.SET_CURRENT_INDEX,Math.floor(Math.random()*length))
  }else{
    return
  }
}

export const deleteSong=async function({commit,state},song){
    let playlist=state.playlist
    let currentIndex=state.currentIndex
    let deleteIndex=playlist.findIndex((item)=>{return item.id===song.id})
    if(currentIndex>deleteIndex||currentIndex===(playlist.length-1)){
       currentIndex--
    }
    playlist.splice(deleteIndex,1)
    commit(types.SET_SEQUENCE_LIST,playlist)
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    if(!playlist.length){
       commit(types.SET_PLAYING_STATE,false)
    }
}

export const clearSong=function({commit,state}){
    // console.log(1)
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYING_STATE,false)
}

export const savePlayHistory=function({commit,state},song){
  commit(types.SET_PLAY_HISTORY,savePlay(song))
}