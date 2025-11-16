/**
 * InstantDB Schema 定义
 * 用途: 定义数据库表结构（Schema as Code）
 * 业务逻辑: 激活码管理和用户进度追踪
 */

import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    // 激活码表
    activationCodes: i.entity({
      code: i.string().unique().indexed(),        // 激活码（唯一、索引）
      status: i.string(),                         // 状态: unused | active
      productType: i.string(),                    // 产品类型: schengen | study_abroad | consulting
      userId: i.string().optional(),              // 预留字段，未来关联用户表
      activatedAt: i.number().optional(),         // 激活时间戳
      expiresAt: i.number().optional(),           // 过期时间戳
      createdAt: i.number(),                      // 创建时间戳
    }),
    
    // 用户进度表
    userProgress: i.entity({
      code: i.string().indexed(),                 // 关联的激活码（索引）
      currentStep: i.number(),                    // 当前步骤 (1-10)
      checklist: i.json(),                        // Checklist 数据 (JSON)
      updatedAt: i.number(),                      // 最后更新时间戳
    }),
  },
  links: {},
});

// TypeScript 类型辅助
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

