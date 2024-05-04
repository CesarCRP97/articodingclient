import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ILevelWithImage } from 'app/models/ILevel';
import { IPage } from 'app/models/IPage';
import { PlaylistDetail } from 'app/models/PlaylistDetail';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-playlist-detail',
    templateUrl: './playlist-detail.component.html'
})
export class PlaylistDetailComponent implements OnInit {
    private readonly subRefs$: Subscription[] = [];
    private readonly playlistId: number;

    public readonly isNew: boolean;

    public playlistLevelsColumns = ["id", "title", "owner", "likes", "timesPlayed", "actions"];
    public playlistDetail: PlaylistDetail;
    public formPlaylist: FormGroup;

    public allLevelsColumns = ["id", "title", "owner", "likes", "timesPlayed", "actions"];
    public allLevels: ILevelWithImage[];
    public allLevelsPagination: PageEvent = new PageEvent();
    public allLevelsNameFilter: string;

    public constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private serverService: ServerService,
        private activateRoute: ActivatedRoute,
    ) {
        this.allLevelsPagination.pageIndex = 0;
        this.allLevelsPagination.pageSize = 5;

        const type: string = this.activateRoute['_routerState'].snapshot.url.split('/')[2];
        this.isNew = type === 'new';
        this.playlistId = this.isNew ? undefined : parseInt(type);
    }

    public ngOnInit(): void {
        this.getLevels(this.allLevelsPagination);

        if (!this.isNew) {
            this.getPlaylist();
        } else {
            this.playlistDetail = new PlaylistDetail();
            this.formPlaylist = this.formBuilder.group({
                name: [this.playlistDetail.title],
                enabled: [this.playlistDetail.enabled]
            });
        }
    }

    public editPlaylist(): void {
        if (!this.isNew) {
            this.subRefs$.push(
                this.serverService.putPlaylist({
                    name: this.formPlaylist.controls.name.value,
                    description: this.formPlaylist.controls.description.value,
                    enabled: this.playlistDetail.enabled
                }).subscribe(res => {
                    if (res.status === 200) {
                        this.getPlaylist();
                    } else alert('Algo ha pasado... ' + res.status);
                }, err => alert(err.error.message))
            );
        } else {
            this.subRefs$.push(
                this.serverService.postPlaylist({
                    name: this.formPlaylist.controls.name.value,
                    description: this.formPlaylist.controls.description.value,
                    enabled: this.playlistDetail.enabled,
                    studentsId: [],
                    teachersId: []
                }).subscribe(res => {
                    if (res.status === 200) {
                        const currentUrl = '/#' + res.body.link;
                        this.router.navigateByUrl(currentUrl).then(() => {
                            window.location.reload();
                        });
                    } else alert('Algo ha pasado... ' + res.status);
                }, err => alert(err.error.message))
            );
        }
    }

    public putAllLevelsFilter(): void {
        this.allLevelsPagination.pageIndex = 0;
        this.allLevelsPagination.pageSize = 5;

        this.getLevels(this.allLevelsPagination, this.allLevelsNameFilter === "" ? undefined : this.allLevelsNameFilter);
    }

    private getPlaylist(): void {
        this.subRefs$.push(
            this.serverService.getPlaylist(this.playlistId).subscribe(res => {
                if (res.status !== 200) {
                    alert('Algo ha pasado... ' + res.status);
                    return;
                }

                this.playlistDetail = res.body;
                this.formPlaylist = this.formBuilder.group({
                    name: [this.playlistDetail.title],
                    enabled: [this.playlistDetail.enabled]
                });
            }, err => alert(err.error.message))
        );
    }

    private getLevels(event: PageEvent, nameFilter?: string): void {
        this.allLevelsPagination = event;

        this.subRefs$.push(
            this.serverService.getLevels(this.allLevelsPagination.pageIndex, this.allLevelsPagination.pageSize, null, null, this.allLevelsNameFilter).subscribe(res => {
                if (res.status !== 200) {
                    alert('Algo ha pasado... ' + res.status);
                    return;
                }

                const response: IPage<ILevelWithImage> = res.body;
                this.allLevels = response.content;
                this.allLevelsPagination.pageIndex = response.pageable.pageNumber;
                this.allLevelsPagination.pageSize = response.pageable.pageSize;
                this.allLevelsPagination.length = response.totalElements;
            }, err => alert(err.error.message))
        );
    }
}
