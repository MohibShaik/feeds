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
import { DataService } from '../services';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpCallInterceptor implements HttpInterceptor {
    isLoading = false;
    loaderToShow: any;
    accessToken
    constructor(public loadingController: LoaderService, private storage: DataService) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.loadingController.present();

        this.storage.get('accessToken').then(data => {
            this.accessToken = data;
            console.log(this.accessToken);
        });

        const tokenizedRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.accessToken}`,
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
