// 对html5中提供的localStorage和sessionStorage进行封装
const localStorage = {
  // 获取
  getItem(key) {
    try {
      let value = window.localStorage.getItem(key);
      if (!value || value === "") {
        return null;
      }
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  },

  // 添加
  setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  // 删除
  removeItem(key) {
    window.localStorage.removeItem(key);
  },

  // 清除
  clear() {
    window.localStorage.clear();
  },

  // 长度
  length() {
    return window.localStorage.length;
  }
};

export const sessionStorage = {
  // 获取
  getItem(key) {
    try {
      let value = window.sessionStorage.getItem(key);
      if (value === null || value === undefined || value === "") {
        return null;
      }
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  },

  // 添加
  setItem(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },

  // 删除
  removeItem(key) {
    window.sessionStorage.removeItem(key);
  },

  // 清除
  clear() {
    window.sessionStorage.clear();
  },

  // 长度
  length() {
    return window.localStorage.length;
  }
};

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LEN = 15;

const PLAY_KEY = "__play__"
const PLAY_MAX_LEN=200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

export function saveSearch(query) {
  let searches = localStorage.getItem(SEARCH_KEY) || [];
  insertArray(
    searches,
    query,
    item => {
      return item === query;
    },
    SEARCH_MAX_LEN
  );
  localStorage.setItem(SEARCH_KEY, searches);
  return searches;
}

export function loadSearch(){
  return localStorage.getItem(SEARCH_KEY) || []
}

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
      this.splice(index, 1);
  }
};
export function deleteSearch(query){
  let searches = localStorage.getItem(SEARCH_KEY) || []
  searches.remove(query)
  localStorage.setItem(SEARCH_KEY, searches)
  return searches 
}
export function clearSearch(){
  localStorage.setItem(SEARCH_KEY, [])
  return []
}

export function savePlay(song) {
  let searches = localStorage.getItem(PLAY_KEY) || [];
  insertArray(
    searches,
    song,
    item => {
      return item.name === song.name;
    },
    PLAY_MAX_LEN
  );
  localStorage.setItem(PLAY_KEY, searches);
  return searches;
}

export function loadPlay(){
  return localStorage.getItem(PLAY_KEY) || []
}