export let API_ROOT = 'https://backend.yseller.pro/'

export const API_BASE = () => `${API_ROOT}api/v1/`

export const ITEMS_GET = (search, page) => `${API_BASE()}articles?page=${page}&${search !== '' ? 'search=' + search : ''}`;
export const ORDERS_POST_ORDER = () => `${API_BASE()}order`








export const ARTICLES_GET_ARTICLE = (articleId) => `${API_BASE()}articles/${articleId}`;
export const ARTICLES_GET_AND_UPDATE_ARTICLE = (articleId) => `${API_BASE()}articles/${articleId}`;

export const BUYOUTS_GET_ALL_BUYOUTS = () => `${API_BASE()}buyouts`
export const BUYOUTS_CREATE_NEW_BUYOUT = () => `${API_BASE()}buyouts`
export const BUYOUTS_CHANGE_BUYOUT_STATUS_TO_CHECK_PAYMENT = (id) => `${API_BASE()}buyouts/${id}/payment`
export const BUYOUTS_GET_BUYOUT_STATUS = (id) => `${API_BASE()}buyouts/${id}/status`
export const BUYOUTS_GET_PAYMENT_QR = (id) => `${API_BASE()}buyouts/${id}/payment/qrcode`

export const DELIVERIES_GET_ALL_DELIVERIES = () => `${API_BASE()}buyouts/paid`

export const AUTHENTICATE = () => `${API_BASE()}auth/authenticate`
export const GET_USER_INFO = () => `${API_BASE()}users`


export const GET_OPERATIONS_HISTORY = () => `${API_BASE()}payments`
export const TOPUP_BALANCE = () => `${API_BASE()}payments`

export const GET_DELIVERY_ADDRESSES = () => `${API_BASE()}pickuppoints`

export const GET_TARIFF = () => `${API_BASE()}tariff`