export const API_ROOT = 'http://localhost:8080/'
// export const API_ROOT = 'https://lego-bricks-343194171424.europe-north1.run.app/'
export const API_BASE = () => `${API_ROOT}`

export const ITEMS_GET = (search, page, category) => `${API_BASE()}catalog?page=${page}${search !== '' ? '&search=' + search : ''}${category !== '' ? '&category=' + category : ''}`;
export const ITEMS_GET_ITEM_BY_ID = (id) => `${API_BASE()}catalog_item/${id}`;
export const ORDERS_POST_ORDER = () => `${API_BASE()}cart`;
export const CATEGORIES_GET = () => `${API_BASE()}category-structure`;
export const GET_PRESIGNED_URL = () => `${API_BASE()}presigned_url`;
export const WANTED_LIST = () => `${API_BASE()}wanted_list`;
export const SETTINGS_GET = () => `${API_BASE()}settings`;
