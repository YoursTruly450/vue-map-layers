import axios from 'axios';

export default ({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getrandomText(ctx, {type, number}) {
      const url = `https://fish-text.ru/get?type=${type}&number=${number}&format=json`;
      const text = new Promise((res) => {
        axios({
          method: 'GET',
          url: url
        })
          .then(response => {
            const text = response.data.text;
            res(text);
          })
          .catch(error => console.error(error));
      });
      return text;
    }
  }
})