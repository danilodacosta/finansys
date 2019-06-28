import { EntryService } from './../shared/entry.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  public entries: Entry[];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      (entries => this.entries = entries),
      (error: any) => alert('Error ao carregar lista de categorias'));
    }

    deleteEntry(entry: Entry) {

      const mustDelete = confirm('Deseja realmente excluir esse item ?');

      if (mustDelete) {
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element !== entry),
        () => alert('Erro ao tentar excluir !')
      );
    }
  }
}
