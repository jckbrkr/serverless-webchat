import {Injectable, Output} from '@angular/core';
import {Observable, Observer, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor() {
  }

  subject: Subject<any>;

  public connect(url, username): Subject<any> {
    if (!this.subject) {
      this.subject = this.create(url, username);
    }
    return this.subject;
  }

  private create(url, username): Subject<any> {
    let ws = new WebSocket(url);

    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      ws.onopen = () => {
        const data = {
          action: 'sendUsername',
          username: username
        }
        ws.send(JSON.stringify(data))
      }
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }
}
