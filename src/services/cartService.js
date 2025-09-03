import axios from './httpRequester';

export const addItem = params => {
  return axios.post('/cart', params).catch(e => e.response);
}

export const getItem = () => {
  return axios.get('/cart').catch(e => e.response);
}

export const updateQuantity = args => {
  return axios.patch('/cart', args).catch(e => e.response);
}

export const removeItem = cartId => {
  return axios.delete(`/cart/${cartId}`).catch(e => e.response);
}

export const removeCart = () => {
  return axios.delete('/cart').catch(e => e.response);
}