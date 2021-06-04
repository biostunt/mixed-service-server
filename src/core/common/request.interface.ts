export interface WebSocketRequest {
    /**
     * Unique identifier of request
     * @example f9b9f89b3ffb594b17e3
     */
    id: string;
    
    /**
     * Route that should be handled
     */
    route: string;

    /**
    * Some data from client
    */
    data: any;
}