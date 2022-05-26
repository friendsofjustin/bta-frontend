import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { SubscriptionService, UtilsService } from 'src/app/@core/services';
import { IAppResponse } from 'src/app/@core/interfaces/app-response.interface';
import { ISubscription } from 'src/app/@core/interfaces/subscription.interface';
import { ISubscriptionAndCountryList } from 'src/app/@core/services/subscription.service';
import { ICompany, IUserCompany, IUserRes } from 'src/app/@core/interfaces/user-data.interface';
import { IFormControls } from 'src/app/@core/interfaces/common.interface';

@Component({
    selector: 'app-add-subscription-type',
    templateUrl: './add-subscriptionType.component.html'
})
export class AddSubscriptionTypeComponent implements OnInit {
    data!: IUserRes;
    companyId!: string;
    name!: string;
    type!: string;
    selectedUserId!: string;
    loading = false;
    public addSubscriptionFormGroup!: FormGroup;
    submitted = false;
    options = {};
    organizationList!: ICompany[];
    subscriptionTypes!: ISubscription[];
    ownCompany!: IUserCompany | undefined;

    constructor(private fb: FormBuilder, public utilsService: UtilsService, protected ref: NbDialogRef<AddSubscriptionTypeComponent>, private readonly subscriptionService: SubscriptionService) {
        this.populateSubscriptionTypes();
    }

    ngOnInit(): void {
        this.ownCompany = this.data.company.find((element: IUserCompany) => element?.verified && element?.default && !element.isDeleted);
        const userCompanies = Array.from(new Set(this.data.company.filter((company: IUserCompany) => company.isAdmin).map((company: IUserCompany) => company.companyId._id))).map((companyId) => this?.data?.company?.find((com: IUserCompany) => com.companyId._id === companyId)?.companyId);
        this.organizationList = userCompanies as ICompany[];
        this.addSubscriptionFormGroup = this.fb.group({
            userId: [this.selectedUserId, [Validators.required]],
            subscriptionType: [[], [Validators.required]],
            companyId: [this.ownCompany?.companyId?._id ? this.ownCompany?.companyId?._id : userCompanies[0]?._id, [Validators.required]]
        });
        this.patchSubscriptionTypes((this.ownCompany?.companyId as ICompany) ?? userCompanies[0]);
    }

    patchSubscriptionTypes(selectedCompany: ICompany): void {
        const subsTypes = this.data?.company.filter((com: IUserCompany) => com?.companyId?._id === selectedCompany?._id).map((com: IUserCompany) => com.subscriptionType);
        this.addSubscriptionFormGroup.patchValue({
            subscriptionType: subsTypes
        });
    }

    populateSubscriptionTypes(): void {
        this.subscriptionService.getAllSubscription().subscribe((res: IAppResponse<ISubscription[] | ISubscriptionAndCountryList>) => {
            if (res && res.success) {
                this.subscriptionTypes = (res?.data as ISubscription[])?.filter((subscription: ISubscription) => subscription.subscriptionTypeIdentifier !== 'super-admin');
            }
        });
    }

    onCompanyChange(companyId: string): void {
        this.patchSubscriptionTypes(this.organizationList.find((company: ICompany) => company._id === companyId) as ICompany);
    }

    submitaddSubscriptionFormGroup({ valid }: FormGroup): void {
        this.submitted = true;
        if (!valid) {
            return;
        }
        this.loading = true;
    }

    get UF(): IFormControls {
        return this.addSubscriptionFormGroup.controls;
    }

    closeModal(): void {
        this.ref.close('close');
    }
}
