import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ComponentRef,
} from '@angular/core';
import { ToastComponent } from '../modules/shared/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  defautTime = 5000;
  private currentToast: ComponentRef<ToastComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  private showToast(message: string, type: string, duration: number): void {
    this.close(); // Close any existing toast before showing a new one

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
    const componentRef = componentFactory.create(this.injector);

    componentRef.instance.message = message;
    componentRef.instance.type = type;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.currentToast = componentRef;

    setTimeout(() => {
      this.close();
    }, duration);
  }

  showSuccess(message: string, duration: number = this.defautTime): void {
    this.showToast(message, 'success', duration);
  }

  showError(message: string, duration: number = this.defautTime): void {
    this.showToast(message, 'error', duration);
  }

  showInfo(message: string, duration: number = this.defautTime): void {
    this.showToast(message, 'info', duration);
  }

  showWarning(message: string, duration: number = this.defautTime): void {
    this.showToast(message, 'warning', duration);
  }

  close(): void {
    if (this.currentToast) {
      this.appRef.detachView(this.currentToast.hostView);
      this.currentToast.destroy();
      this.currentToast = null;
    }
  }
}
