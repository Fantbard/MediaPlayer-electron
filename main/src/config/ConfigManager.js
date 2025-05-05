import { get, set, deepMerge } from "./utils";
import fs from "fs";

/**
 * 可复用的通用配置管理器
 */
export default class ConfigManager {
  /**
   * 构造函数
   * @param {Object} defaults 默认配置对象
   * @param {Object} options 额外选项：{ autoSave: true, persistenceProvider: fs }
   */
  constructor(defaults = {}, options = {}) {
    this.defaults = defaults;
    this.options = {
      autoSave: true,
      persistenceProvider: fs, // 用于持久化的模块，如 fs
      persistencePath: null, // 配置文件路径
      ...options,
    };

    this.config = deepMerge({}, this.defaults);
    this.watchers = [];
    this.pendingSave = null;

    this.scheduleTime = 500;

    if (this.options.persistenceProvider && this.options.persistencePath) {
      this.load();
    }
  }

  /**
   * 获取配置（支持点路径）
   * @param {string} path 配置路径
   * @param {*} defaultValue 默认值
   * @returns {*}
   */
  get(path, defaultValue = undefined) {
    return get(this.config, path, defaultValue);
  }

  /**
   * 设置配置并自动保存
   * @param {string} path 配置路径
   * @param {*} value 新值
   */
  set(path, value) {
    const oldValue = this.get(path);
    if (oldValue === value) return;
    set(this.config, path, value);

    if (this.options.autoSave) {
      this.scheduleSave();
    }

    this._notifyWatchers(path, value, oldValue);
  }

  /**
   * 使用更新函数更新整个配置（不可变方式）
   * @param {Function} updater 接收当前配置返回新配置
   */
  update(updater) {
    const oldConfig = this.getAll();
    this.config = updater(deepMerge({}, oldConfig));
    if (this.options.autoSave) {
      this.scheduleSave();
    }
    this._notifyWatchers("", this.config, oldConfig);
  }

  /**
   * 立即保存配置到磁盘
   */
  saveSync() {
    // 使用临时文件+重命名实现原子写入
    const tempPath = this.options.persistencePath + ".tmp";
    try {
      this.options.persistenceProvider.writeFileSync(
        tempPath,
        JSON.stringify(this.config, null, 2)
      );
      this.options.persistenceProvider.renameSync(
        tempPath,
        this.options.persistencePath
      );
    } catch (e) {
      // 清理临时文件
      try {
        this.options.persistenceProvider.unlinkSync(tempPath);
      } catch {}
      console.error("Failed to save config:", e);
    }
  }

  /**
   * 延迟保存配置（去抖模式）
   */
  scheduleSave() {
    if (this.pendingSave) clearTimeout(this.pendingSave);
    this.pendingSave = setTimeout(() => {
      this.saveSync();
      this.pendingSave = null;
    }, this.scheduleTime);
  }

  /**
   * 从磁盘加载配置
   */
  load() {
    try {
      const data = this.options.persistenceProvider.readFileSync(
        this.options.persistencePath,
        "utf-8"
      );
      const loaded = JSON.parse(data);

      if (this.options.migrate && loaded.version !== this.defaults.version) {
        this.config = deepMerge(
          deepMerge({}, this.defaults),
          this.options.migrate(loaded)
        );
      } else {
        this.config = deepMerge(deepMerge({}, this.defaults), loaded);
      }
    } catch (e) {
      // 文件不存在或读取失败时使用默认配置
      this.config = deepMerge({}, this.defaults);
    }
  }

  /**
   * 监听某个路径的配置变化
   * @param {string} path 要监听的路径
   * @param {Function} callback 回调函数 (newVal, oldVal)
   * @return {Function} 取消监听的函数
   */
  watch(path, callback, options = {}) {
    const watcher = {
      path,
      callback,
      options: {
        deep: false,
        immediate: false,
        ...options,
      },
    };
    this.watchers.push(watcher);

    if (options.immediate) {
      const initialValue = this.get(path);
      callback(initialValue, initialValue);
    }

    return () => {
      this.watchers = this.watchers.filter((w) => w !== watcher);
    };
  }

  /**
   * 内部方法：通知所有监听者
   */
  _notifyWatchers(changedPath, newValue, oldValue) {
    for (const watcher of this.watchers) {
      const { path, callback, options } = watcher;

      if (changedPath.startsWith(path)) {
        if (options.deep || changedPath === path) {
          callback(newValue, oldValue);
        }
      }
    }
  }

  /**
   * 校验配置是否符合给定规则
   * @param {Object} rules 校验规则对象，格式：{ path: [validatorFn1, validatorFn2] }
   * @returns {{valid: boolean, errors: Array}}
   */
  validate(rules) {
    const errors = [];
    let valid = true;

    for (const path in rules) {
      const validators = rules[path];
      if (!Array.isArray(validators)) continue;

      const value = this.get(path);

      for (const validator of validators) {
        const result = validator(value);
        if (typeof result === "string") {
          // 字符串表示错误信息
          errors.push(`Validation failed for "${path}": ${result}`);
          valid = false;
        } else if (result !== true) {
          // 非 true 值视为失败
          errors.push(`Validation failed for "${path}" with value: ${value}`);
          valid = false;
        }
      }
    }

    return { valid, errors };
  }

  /**
   * 获取完整配置
   * @returns {Object}
   */
  getAll() {
    return deepMerge({}, this.config);
  }

  /**
   * 重置为默认配置
   */
  resetToDefaults() {
    this.config = deepMerge({}, this.defaults);
    this.saveSync();
  }

  /**
   * 销毁实例，清除资源
   */
  destroy() {
    if (this.pendingSave) clearTimeout(this.pendingSave);
    this.watchers = [];
    this.config = {};
  }
}
