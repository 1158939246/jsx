export default class Song{
    constructor({id,ar,name,al,dt}){
        this.id=id,
        this.name=name,
        this.album=al,
        this.duration=dt,
        this.artist=ar
    }
}

export function createSong(musicData){
    return new Song({
        musicData
    })
}

