import {Publisher, Subjects, TicketCreatedEvent} from "@kogeertix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
