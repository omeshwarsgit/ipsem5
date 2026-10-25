package com.apexgarage.dto;

import com.apexgarage.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {
    @NotNull
    private BookingStatus status;
    private String notes;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(BookingStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public static StatusUpdateRequestBuilder builder() {
        return new StatusUpdateRequestBuilder();
    }

    public static class StatusUpdateRequestBuilder {
        private BookingStatus status;
        private String notes;

        public StatusUpdateRequestBuilder status(BookingStatus status) { this.status = status; return this; }
        public StatusUpdateRequestBuilder notes(String notes) { this.notes = notes; return this; }

        public StatusUpdateRequest build() {
            return new StatusUpdateRequest(status, notes);
        }
    }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
