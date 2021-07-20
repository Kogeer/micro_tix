import {Publisher, Subjects, TicketUpdatedEvent} from "@kogeertix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
