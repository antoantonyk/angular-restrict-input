import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef,
  Renderer2,
  Input
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Directive({
  selector: "[restrict-input]",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RestrictInputDirective),
      multi: true
    }
  ]
})
export class RestrictInputDirective implements ControlValueAccessor {
  @Input()
  enableValidation = false;

  constructor(public elementRef: ElementRef, private renderer2: Renderer2) {}

  @Input("restrict-input")
  set setType(type) {
    if (this.patterns[type]) {
      this.pattern = new RegExp(this.patterns[type]);
    }
  }

  pattern: { test: any } = {
    test: value => false
  };

  patterns = {
    numberOnly: "^[0-9]+$"
  };

  _preValue: any = "";

  public onChange = (_: any) => {};
  public onTouch = () => {};

  @HostListener("input", ["$event"])
  public onInput(e: any): void {
    this.writeValue(e.target.value);
  }

  @HostListener("change", ["$event"])
  public onInputChange(e: any): void {
    this.writeValue(e.target.value);
  }

  @HostListener("blur", ["$event"])
  public onBlur(e: Event): void {
    this.onTouch();
  }

  public validateValue(value) {
    return this.pattern.test(value);
  }

  /** It writes the value in the input */
  public writeValue(value: string | number): void {
    console.log("value", value);

    if (this.enableValidation) {
      if (this.validateValue(value)) {
        this._preValue = value;
      } else {
        value = this._preValue;
      }
    }

    this.onChange(value);
    this.renderer2.setProperty(this.elementRef.nativeElement, "value", value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
