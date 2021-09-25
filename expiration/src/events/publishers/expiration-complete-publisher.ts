import {ExpirationCompleteEvent, Publisher, Subjects} from "@kogeertix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}