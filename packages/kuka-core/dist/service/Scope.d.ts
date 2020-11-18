export default class ScopeService {
    getScopes(username: string): Promise<string[] | boolean>;
    addScope(username: string, scope: string): Promise<void>;
    removeScope(username: string, scope: string): Promise<void>;
}
