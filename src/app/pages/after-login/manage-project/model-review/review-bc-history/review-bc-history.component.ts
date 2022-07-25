import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { IBcModelReview, IBcProjectVersion, IModelReviewBcHistory } from 'src/app/@core/interfaces/bc-manage-project.interface';
import { VersionStatus } from 'src/app/@core/interfaces/manage-project.interface';
import { BcManageProjectService, FileService } from 'src/app/@core/services';

@Component({
    selector: 'app-model-review-bc-history',
    templateUrl: './review-bc-history.component.html',
    styleUrls: ['./review-bc-history.component.scss']
})
export class ModelReviewBcHistoryComponent implements OnInit {
    modelVersionBcDetails!: IBcProjectVersion;
    modelReviewBcDetails!: IBcModelReview;
    modelReviewBcHistory!: Array<IModelReviewBcHistory>;

    totalRecords = 0;
    dataFound!: boolean;
    loading!: boolean;
    modelVersionStatus = VersionStatus;

    constructor(private activeRoute: ActivatedRoute, private bcManageProjectService: BcManageProjectService, private readonly fileService: FileService) {}

    ngOnInit(): void {
        const versionId = this.activeRoute.snapshot.params['id'];
        this.getModelVersionBcDetails(versionId);
        this.getModelReviewBlockChainDetails(versionId);
    }

    getModelVersionBcDetails(versionId: string): void {
        this.loading = true;

        this.bcManageProjectService
            .getProjectVersionBcDetails(versionId)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe({
                next: (res) => {
                    if (res && res.success) {
                        const { data } = res.data;
                        this.modelVersionBcDetails = data;
                        this.dataFound = true;
                    } else {
                        this.dataFound = false;
                    }
                },
                error: () => {
                    this.dataFound = false;
                }
            });
    }

    getModelReviewBlockChainDetails(versionId: string): void {
        this.loading = true;

        this.bcManageProjectService
            .getModelReviewBcHistory(versionId)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe({
                next: (res) => {
                    if (res && res.success) {
                        const { data } = res.data;
                        if (data.length) {
                            this.totalRecords = data?.length;
                            if (!this.totalRecords) {
                                this.dataFound = false;
                            } else {
                                this.dataFound = true;
                            }
                            this.modelReviewBcHistory = data;
                        } else {
                            this.totalRecords = 0;
                        }
                    }
                },
                error: () => {
                    this.dataFound = false;
                }
            });
    }

    totalRating(): number[] {
        return new Array(5);
    }

    createRange(number: number): number[] {
        return new Array(number);
    }

    changeVersionStatusColor(versionStatus: string): string {
        if (versionStatus === this.modelVersionStatus.REVIEW) {
            return '#FF6666';
        } else if (versionStatus === this.modelVersionStatus.REVIEW_PASSED) {
            return '#339933';
        } else if (versionStatus === this.modelVersionStatus.REVIEW_FAILED) {
            return '#CC0033';
        } else if (versionStatus === this.modelVersionStatus.DEPLOYED) {
            return '#304ea9';
        } else if (versionStatus === this.modelVersionStatus.PRODUCTION) {
            return '#993366';
        } else if (versionStatus === this.modelVersionStatus.MONITORING) {
            return '#FF7F00';
        } else if (versionStatus === this.modelVersionStatus.COMPLETE) {
            return '#336666';
        } else {
            return '#666';
        }
    }

    openDocs(filename: string): void {
        this.fileService.getFileFromFolder(filename).subscribe((file: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            const url = urlCreator.createObjectURL(file);
            window.open(url);
            urlCreator.revokeObjectURL(url);
        });
    }
}