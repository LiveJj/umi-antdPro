export default {
  namespace: 'market',
  state: {
    clname: '首页',
    xlname: '轮播',
  },
  effects: {},
  reducers: {
    updateState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
