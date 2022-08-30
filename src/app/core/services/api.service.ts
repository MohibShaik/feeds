import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * @const {object} API_CONFIG
 * @desc define constant for API calls
 */
const API_CONFIG = {
  apiHost: environment.apiUrl,
};

/**
 * @const {object} API
 * @desc List of all API urls
 */
const API_URLS = {

  signup: `/users/signup`,
  login: `/users/login`,
  verify: `/users/verify`,
  updateUserInfo: `/users/update-user-info`,
  getUserInfo: (userId: any) => `/users/profile/${userId}`,
  uploadUserAvator:`/users/update-user-avator`,
  getUsersList : `/users/list`,
  // posts API endpoints
  listOfPosts: `/posts`,
  likePostById: (postId: string) => `/posts/${postId}/like`,
  unlikePostById: (postId: string) => `/posts/${postId}/unlike`,
  commentPostById: (postId: string) => `/posts/${postId}/comment`,
  userFeedsById: (userId: string) => `/posts/user/${userId}/`,
  uploadAFeed: `/posts/upload`

};

@Injectable({
  providedIn: 'root',
})

/**
 * @class ApiService
 * @desc Provides API Configuration (Url, Host)
 * for Application to make HTTP API calls
 */
export class ApiService {
  constructor() { }

  /**
   * @prop API_URLs
   * @return {object} API_URLS object with api urls;
   */
  get API_URLs() {
    return API_URLS;
  }

  /**
   * @prop API_CONFIG
   * @return {object} API_CONFIG object with api configuration e.g HOST value;
   */
  get API_CONFIG() {
    return API_CONFIG;
  }
}
