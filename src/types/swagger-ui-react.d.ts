declare module 'swagger-ui-react' {
  import { Component } from 'react';

  export interface SwaggerUIProps {
    url?: string;
    spec?: Record<string, unknown>;
    dom_id?: string;
    [key: string]: unknown;
  }

  export default class SwaggerUI extends Component<SwaggerUIProps> {}
}
