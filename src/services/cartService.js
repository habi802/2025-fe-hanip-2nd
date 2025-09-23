import axios from './httpRequester';

export const addItem = data => {
  return axios.post('/cart', data).catch(e => e.response);
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

export const plusQuantity = cartId => {
  return axios.patch(`/cart/plus/${cartId}`).catch((e)=>e.response);
}

export const minusQuantity = cartId => {
  return axios.patch(`/cart/minus/${cartId}`).catch((e)=>e.response);
}