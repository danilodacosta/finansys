import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';


export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T
   ) {
     this.route = this.injector.get(ActivatedRoute);
     this.router = this.injector.get(Router);
     this.formBuilder = this.injector.get(FormBuilder);
    }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
       this.createCategory(); // criando categoria
    } else {
      this.updateCategory(); // editando categoria
    }
  }

  // PRIVATE METHODS

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
         this.currentAction = 'new';
    } else {
       this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
      this.categoryForm = this.formBuilder.group({
        id : [null],
        name: [null, [Validators.required, Validators.minLength(2)]],
        description: [null]
      });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {

        this.route.paramMap.pipe(
          switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (category) => {
         this.category = category;
         this.categoryForm.patchValue(category); // binds loaded category data to category forms. setando valores retonados
        },
        (error) => toastr.error('Ocorreu um erro no servidor, tente novamente mais tarde')
      );
    }
  }

private setPageTitle() {
  if (this.currentAction === 'new') {
      this.pageTitle =  'Cadastro de Nova Categoria';
  } else {
    const categoryName = this.category.name || '';
    this.pageTitle = 'Editando Categoria: ' + categoryName;
  }
}

private createCategory() {
  const category: Category = Object.assign(new Category(), this.categoryForm.value);

  this.categoryService.create(category)
  .subscribe(
    category => this.actionsForSuccess(category),
    error => this.actionsForError(error)
  );

}

private updateCategory() {
  const category: Category = Object.assign(new Category(), this.categoryForm.value);
  this.categoryService.update(category)
  .subscribe(
    category => this.actionsForSuccess(category),
    error => this.actionsForError(error)
  );

}

private actionsForSuccess(category: Category) {
  toastr.success('Solicitação processada com sucesso!');

  // skipLocationChange: true - não armazenar no historico de navegação do browser.
  this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
    () => this.router.navigate(['categories', category.id, 'edit'])
  ); // redirect component page.
}

private actionsForError(error) {
  toastr.error('Ocorreu um erro ao processar a sua solicitação');

  this.submittingForm = false;

  if (error.status === 422) {
    this.serverErrorMessages = JSON.parse(error._body).errors;
  } else {
    this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor tente mais tarde.'];
  }
}
}


