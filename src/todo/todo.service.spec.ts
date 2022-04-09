import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { ITodo } from './interfaces/todo.interface';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('getAllTodos', () => {
    it('should return a todo list', async () => {
      // Arange
      const expected: ITodo[] = [
        {
          userId: 2,
          id: 39,
          title:
            'doloremque quibusdam asperiores libero corrupti illum qui omnis',
          completed: false,
        },
      ];

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          status: 200,
          statusText: 'OK',
          config: {},
          headers: {},
          data: expected,
        }),
      );

      // Act
      const result = await todoService.getAllTodos();

      // Asert
      expect(result).toEqual(expected);
    });

    it('should return a empty array', async () => {
      // Arange
      const expected: ITodo[] = [];

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          status: 204,
          statusText: 'OK',
          config: {},
          headers: {},
          data: [],
        }),
      );

      // Act
      const result = await todoService.getAllTodos();

      // Asert
      expect(result).toEqual(expected);
    });

    it('should throw an unexpected error', () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(new Error()));

      // Asert
      expect(todoService.getAllTodos()).rejects.toThrowError();
    });
  });
});
