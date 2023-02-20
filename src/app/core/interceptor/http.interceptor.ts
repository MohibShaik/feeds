import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, finalize } from 'rxjs/operators';
import { ToasterService, DataService } from '../services';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpCallInterceptor implements HttpInterceptor {
    constructor(
        private toasterservice: ToasterService,
        private loadingController: LoaderService,
        private storage: DataService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // this.loadingController.present();
        const accessToken = this.storage.getItem('accessToken')
        const tokenizedRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return next
            .handle(tokenizedRequest)
            .pipe(
                retry(0),
                // finalize(() => this.loadingController.dismiss()),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 400) {
                        // this.spinner.hide();
                        this.toasterservice.presentToast(error.error || error.message);
                    } else if (error.status === 500) {
                        // this.spinner.hide();
                        this.toasterservice.presentToast(error.error);
                    }
                    return throwError(error);
                })
            );
    }
}
