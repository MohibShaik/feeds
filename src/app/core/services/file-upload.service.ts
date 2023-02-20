import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8080/posts/upload';
  constructor(private http: HttpClient, private storage: DataService) { }


  upload(url: string, formData: any) {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storage.getItem('accessToken')}`,
      responseType: 'json'
    });

    let options = { headers: headers };

    return this.http.post(url, formData, options)
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }


}