export class LoggerService {
    static log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[${level.toUpperCase()}] ${timestamp}:`;
        console.log(`${prefix} ${message}`);
    }
}