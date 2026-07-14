export class ErrorResponse  {
    constructor(
        public message,
        public error,
        public success= false,
        public data={},
    ) {
    }
}
export class SuccessResponse {
    constructor(
        public message,
        public data,
        public success= true,
        public error= {}
    ) {
    }
}
