import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
} from '@angular/core';
import { ToastComponent } from '../modules/shared/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  private showToast(message: string, type: string, duration: number): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
    const componentRef = componentFactory.create(this.injector);

    componentRef.instance.message = message;
    componentRef.instance.type = type;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, duration);
  }

  showSuccess(message: string, duration: number = 3000): void {
    this.showToast(message, 'success', duration);
  }

  showError(message: string, duration: number = 3000): void {
    this.showToast(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 3000): void {
    this.showToast(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 3000): void {
    this.showToast(message, 'warning', duration);
  }
}
