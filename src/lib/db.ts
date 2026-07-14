// IndexedDB 資料庫（Dexie）
'use client';

import Dexie, { type Table } from 'dexie';
import type { TaskLog, TaskTemplate } from './types';

export class AIEODatabase extends Dexie {
  tasks!: Table<TaskLog, string>;
  templates!: Table<TaskTemplate, string>;

  constructor() {
    super('ai-employee-outsourcing');
    this.version(1).stores({
      tasks: 'id, createdAt, status',
      templates: 'id, name, createdAt',
    });
  }
}

export const db = new AIEODatabase();