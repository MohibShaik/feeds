/**
 * @file : ajax.service
 * ============================================+
 * Ajax Service: define common methods for
 * - GET
 * - POST
 * - PUT
 * - DELETE
 * ============================================+
 */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AjaxService {
  constructor(private httpClient: HttpClient) { }

  public get(config): Observable<any> {
    const params = new HttpParams();
    if (config.params) {
      for (const param of config.params) {
        params.append(param, config.params[param]);
      }
    }

    // Http headers instance with any headers to add / override in config
    const headers = new HttpHeaders({
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });

    // API `url` from config
    const url = config.url;

    // Making GET call
    let response = this.httpClient.get(url, { params, headers });

    if (config.cacheKey) {
      response.subscribe((next) => {
        localStorage[config.cacheKey] = JSON.stringify(next);
      });

      response = response.pipe(
        startWith(JSON.parse(localStorage[config.cacheKey] || '[]'))
      );
    }
    return response;
  }

  getWithoutAuth(config): Observable<any> {
    // HTTP Param instance
    const params = new HttpParams();

    // If any params in config to override
    if (config.params) {
      for (const param of config.params) {
        params.append(param, config.params[param]);
      }
    }

    // Http headers instance with any headers to add / override in config
    const headers = new HttpHeaders({
      ...config.headers,
    });

    // API `url` from config
    const url = config.url;

    // Making GET call
    console.log(url);
    let response = this.httpClient.get(url, { params, headers });

    if (config.cacheKey) {
      response.subscribe((next) => {
        localStorage[config.cacheKey] = JSON.stringify(next);
      });

      response = response.pipe(
        startWith(JSON.parse(localStorage[config.cacheKey] || '[]'))
      );
    }
    return response;
  }

  /**
   * @method post
   * @desc Common method for making HTTP POST call and returns `Observable`.
   * @param {object} config config object for making ajax call having details like `url`, `headers` etc.
   * @return {Observable} response returned as observable
   */
  post(config): Observable<any> {
    const httpOptions = config.nohttpOptions
      ? {}
      : {
        withCredentials: false,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          // ...config.headers
        }),
      };

    // API `url`
    const url = config.url;
    const response = this.httpClient.post(url, config.data, httpOptions);
    return response;
  }

  /**
   * @method put
   * @desc Common method for making HTTP PUT call and returns `Observable`.
   * @param {object} config config object for making ajax call having details like `url`, `headers` etc.
   * @return {Observable} response returned as observable
   */
  put(config): Observable<any> {
    const httpOptions = config.nohttpOptions
      ? {}
      : {
        withCredentials: false,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          // ...config.headers
        }),
      };

    // API `url` from config
    const url = config.url;

    // Making PUT call
    const response = this.httpClient.put(url, config.data, httpOptions);
    return response;
  }

  /**
   * @method delete
   * @desc Common method for making HTTP DELETE call and returns `Observable`.
   * @param {object} config config object for making ajax call having details like `url`, `headers` etc.
   * @return {Observable} response returned as observable
   */
  delete(config): Observable<any> {
    const httpOptions = {
      withCredentials: false,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }),
    };

    // API `url` from config
    const url = config.url;
    const response = this.httpClient.delete(url, config.data);
    return response;
  }


}
