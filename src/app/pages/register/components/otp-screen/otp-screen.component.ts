import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.scss'],
})
export class OtpScreenComponent implements OnInit {

  @Output() inputValue = new EventEmitter();
  @Input() details: any;
  @Input() resend: any;
  otpNumbers = [];
  keycode: any;
  size: any;
  counter = false;
  count = 0;

  constructor() { }

  ngOnInit(): void {
    for (let i = 1; i <= this.details; i++) {
      this.otpNumbers.push({
        num: i,
        value: '',
      });
    }
  }

  ngOnChanges() {
    if (this.resend > 0) {
      this.otpNumbers = [];
      this.ngOnInit();
    }
  }
  valueChange(i) {
    this.inputValue.emit({ otp: this.otpNumbers });

    if (this.keycode != 8) {
      if (i < this.details - 1) {
        let element = document.getElementById('_' + (i + 1));
        element.focus();
      }
    }
  }

  keydown(e, i) {
    this.keycode = e.keyCode;
    if (this.keycode === 8) {
      if (i > 0 && i != this.details - 1) {
        let element = document.getElementById('_' + (i - 1));
        element.focus();
      }
      if (i == this.details - 1) {
        if (this.count == 0) {
          let element = document.getElementById('_' + i);
          element.focus();
          this.count++;
        } else if (this.count != 0) {
          let element = document.getElementById('_' + (i - 1));
          element.focus();
          this.count = 0;
        }
      }
    }
  }

}
