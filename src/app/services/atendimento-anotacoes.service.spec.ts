import { TestBed } from '@angular/core/testing';

import { AtendimentoAnotacoesService } from './atendimento-anotacoes.service';

describe('AtendimentoAnotacoesService', () => {
  let service: AtendimentoAnotacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtendimentoAnotacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
