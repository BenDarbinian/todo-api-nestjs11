import { DataSource } from 'typeorm';

import { dataSourceOptions } from './config/database.config';

export default new DataSource(dataSourceOptions);
