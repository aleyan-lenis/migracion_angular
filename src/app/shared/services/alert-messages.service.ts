import { Subject } from 'rxjs';

export interface TypeMessage{
	tipo: "error" | "warning" | "success",
	mensaje: string
}

export class AlertMessagesService{
	public showMessage: Subject<TypeMessage> = new Subject<TypeMessage>();
}