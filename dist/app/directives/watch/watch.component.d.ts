import { EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Watch } from './../../models/watch.model';
import { User } from './../../models/user.model';
import { TwAPIService } from './../../services/twapi.service';
import { FormBuilder, FormGroup } from '@angular/forms';
export declare class WatchComponent implements OnInit {
    protected translate: TranslateService;
    private twapi;
    private builder;
    watchModel: Watch;
    user: User;
    watchSaved: EventEmitter<{}>;
    watchForm: FormGroup;
    brands: {
        name: string;
        icon: string;
        models: string;
    }[];
    models: string[];
    filteredBrandList: {
        name: string;
        icon: string;
        models: string;
    }[];
    filteredModelList: string[];
    error: boolean;
    submitAttempt: boolean;
    /**
     * Constructor with DI
     * @param {TranslateService} private translate [description]
     * @param {TwAPIService}     private twapi     [description]
     * @param {FormBuilder}      private builder   [description]
     */
    constructor(translate: TranslateService, twapi: TwAPIService, builder: FormBuilder);
    fillFormValue(): void;
    /**
     * Pull the brands
     */
    ngAfterViewInit(): void;
    /**
     * [selectBrand description]
     * @param {string} brand [description]
     */
    selectBrand(brand: string): void;
    /**
     * Select a model
     * @param {string} model [description]
     */
    selectModel(model: string): void;
    /**
     * Filter brands according the brand
     * @param {string} brand [description]
     */
    filterBrand(brand: string): void;
    /**
     * Filters models according to model
     * @param {string} model [description]
     */
    filterModel(model: string): void;
    ngOnInit(): void;
    /**
     * Submit a watch
     */
    onSubmit(): void;
    onDelete(): void;
    private watchFromForm();
}
