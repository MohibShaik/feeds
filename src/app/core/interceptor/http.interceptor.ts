import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpCallInterceptor implements HttpInterceptor {
    isLoading = false;
    loaderToShow: any;

    constructor(public loadingController: LoaderService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.loadingController.present();
        const accessToken = localStorage.getItem('accessToken');
        console.log('IM interceptor');

        const tokenizedRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // return next.handle(tokenizedRequest);
        return next.handle(tokenizedRequest).pipe(
            map((event: HttpEvent<any>) => {
                this.loadingController.dismiss();
                return event;
            })
        );
    }
}
