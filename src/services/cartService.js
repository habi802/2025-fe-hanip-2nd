import axios from './httpRequester';

export const addItem = menuId => {
  return axios.post('/cart', { menuId }).catch(e => e.response);
}

export const getItem = () => {
  return axios.get('/cart').catch(e => e.response);
}

export const removeItem = cartId => {
  return axios.delete(`/cart/${cartId}`).catch(e => e.response);
}

export const removeCart = () => {
  return axios.delete('/cart').catch(e => e.response);
}