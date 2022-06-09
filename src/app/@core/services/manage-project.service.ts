import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLConstant } from '../constants';
import { IAppResponse, IPaginateResult } from '../interfaces/app-response.interface';
import { IProject, IProjectVersion } from '../interfaces/manage-project.interface';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ManageProjectService {
    constructor(private readonly http: HttpService) {}

    getAllProject(query: { [key: string]: unknown }): Observable<IAppResponse<IPaginateResult<IProject>>> {
        return this.http.get(URLConstant.getAllProjectURL, query);
    }

    addNewProject(data: IProject): Observable<IAppResponse<IProject>> {
        return this.http.post(URLConstant.createProjectURL, data);
    }

    updateProject(data: IProject, projectId: string): Observable<IAppResponse<IProject>> {
        return this.http.put(URLConstant.updateProjectURL + `/${projectId}`, data);
    }

    deleteProject(projectId: string): Observable<IAppResponse<IProject>> {
        return this.http.delete(URLConstant.deleteProjectURL + `/${projectId}`);
    }

    enableProject(projectId: string): Observable<IAppResponse<IProject>> {
        return this.http.patch(URLConstant.enableProjectURL + `/${projectId}`);
    }

    addVersion(versionData: IProjectVersion, projectId: string): Observable<IAppResponse<IProjectVersion>> {
        return this.http.post(URLConstant.addProjectVersionURL + `/${projectId}`, versionData);
    }

    getVersionInfo(versionId: string): Observable<IAppResponse<IProjectVersion>> {
        return this.http.get(URLConstant.getVersionInfoURL + `/${versionId}`);
    }
}
