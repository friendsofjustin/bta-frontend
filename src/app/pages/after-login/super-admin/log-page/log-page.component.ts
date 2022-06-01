import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { LogPageService } from 'src/app/@core/services';

@Component({
    selector: 'app-log-page',
    templateUrl: './log-page.component.html',
    styleUrls: ['./log-page.component.scss']
})
export class LogPageComponent implements OnInit, AfterViewInit {
    logText!: string;
    loading!: boolean;
    @ViewChild('logContent') logContentTemplate!: ElementRef<HTMLElement>;

    constructor(private readonly logPageService: LogPageService) {}

    ngOnInit(): void {
        this.fetchLogs();
    }

    fetchLogs(): void {
        this.loading = true;
        this.logPageService
            .getLogStreams()
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((res: Blob) => {
                const reader = res.stream().getReader();
                reader.read().then((data) => {
                    this.processText(data, reader);
                });
            });
    }

    ngAfterViewInit(): void {
        if (this.logContentTemplate) {
            this.logContentTemplate.nativeElement.scrollTop = this.logContentTemplate.nativeElement.scrollHeight;
        }
    }

    processText(data: ReadableStreamDefaultReadResult<any>, reader: ReadableStreamDefaultReader<any>): void {
        if (this.logText) {
            this.logText += new TextDecoder().decode(data.value);
        } else {
            this.logText = new TextDecoder().decode(data.value);
        }
        if (!data.done) {
            reader.read().then((data) => {
                this.processText(data, reader);
            });
        } else {
            if (this.logContentTemplate) {
                this.logContentTemplate.nativeElement.scrollTop = this.logContentTemplate.nativeElement.scrollHeight;
            }
        }
    }

    refreshLog(): void {
        this.fetchLogs();
    }
}
