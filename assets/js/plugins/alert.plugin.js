const defaultTemplate = `
  <transition-group
  :name="transitionName"
  :class="outerClass"
  tag="div"
>
  <div
    v-for="(message, index) in storage"
    :key="index"
    :class="cssClasses(index) + ' flash__message'"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
    @mouseover="onMouseOver(index)"
    @mouseleave="onMouseOut(index)"
  >
    <div class="flash__message-content" v-html="message.content"></div>
    <button v-if="!message.options.important"
      type="button"
      class="flash__close-button"
      data-dismiss="alert"
      aria-label="alertClose"
      @click.stop.prevent="destroyFlash(index)"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</transition-group>
\`;
  `

function isFunction(functionToCheck) {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var FlashMessage = function(Bus, messageContent, messageType, messageOptions, globalDefaults) {

  const defaults = {
    autoEmit: true,
    important: false,
    pauseOnInteract: false,
    timeout: 0,

    // callbacks
    beforeDestroy: null,
    onStartInteract: null,
    onCompleteInteract: null,
  };
  this.storage = Bus;
  this.content = messageContent;
  this.options = Object.assign(defaults, globalDefaults, messageOptions);
  this.type = messageType;
  this.id = uuidv4();
  this.timer = null;

  if (this.options.autoEmit) {
    this.emit();
  }

  this.emit = function() {
    this.storage.push(this.id, this);
    this.startSelfDestructTimer();
  }

  this.destroy = function() {
    this.killSelfDestructTimer();
    this.beforeDestroy();
    this.storage.destroy(this.id);
  }

  this.setSelfDestructTimeout = function(timeout) {
    this.options.timeout = timeout;
  }

  this.startSelfDestructTimer = function() {
    if (this.options.timeout > 0) {
      setTimeout(() => {
        this.destroy();
      }, this.options.timeout);
    }
  }

  this.killSelfDestructTimer = function() {
    clearTimeout(this.timer);
  }

  this.beforeDestroy = function() {
    if (isFunction(this.options.beforeDestroy)) {
      this.options.beforeDestroy();
    }
  }

  this.onStartInteract = function() {
    if (this.options.pauseOnInteract) {
      this.killSelfDestructTimer();
    }
    if (isFunction(this.options.onStartInteract)) {
      this.options.onStartInteract();
    }
  }

  this.onCompleteInteract = function() {
    if (this.options.pauseOnInteract) {
      this.startSelfDestructTimer();
    }
    if (isFunction(this.options.onCompleteInteract)) {
      this.options.onCompleteInteract();
    }
  }

  return this;
}


var FlashMessageComponent = function({
                                       // <Number> duration of auto close flash message (in milliseconds)
                                       duration = 3000,
                                       // <String> template to use display flash
                                       template = defaultTemplate,
                                       // <Array> custom css classes for template
                                       css = null,
                                     } = {}, bus,) {

  return {
    template,
    props: {
      transitionName: {
        type: String,
        default: 'flash-transition',
      },
      outerClass: {
        type: String,
        default: 'flash__wrapper',
      },
    },
    data() {
      return Object.assign({
        message: null,
        closed: false,
        _timeout: null,
      }, { duration, css });
    },
    computed: {
      storage() {
        return bus.storage;
      },
    },
    methods: {
      cssClasses(id) {
        return this.getFlash(id).type;
      },
      getFlash(id) {
        return this.storage[id];
      },
      destroyFlash(id) {
        this.getFlash(id).destroy();
      },
      onMouseOver(id) {
        this.getFlash(id).onStartInteract();
      },
      onMouseOut(id) {
        this.getFlash(id).onCompleteInteract();
      },
    }
  }

}


var MyPlugin = {
  install (Vue, config = {}) {
    const defaults = {
      method: 'flash',
      storage: '$flashStorage',
      createShortcuts: true,
      name: 'flash-message',
    };
    const options = Object.assign(defaults, config);

    const FlashBus = new Vue({
      data() {
        return {
          storage: {
          },
        };
      },
      methods: {
        flash(msg, type, opts) {
          return new FlashMessage(FlashBus, msg, type, opts);
        },
        push(id, message) {
          Vue.set(this.storage, id, message);
        },
        destroy(id) {
          Vue.delete(this.storage, id);
        },
        destroyAll() {
          Vue.set(this, 'storage', {});
        },
      },
    });

    const shortcuts = !options.createShortcuts ? {} : {
      info(msg, opts) {
        return this[options.method](msg, 'info', opts);
      },
      error(msg, opts) {
        return this[options.method](msg, 'error', opts);
      },
      warning(msg, opts) {
        return this[options.method](msg, 'warning', opts);
      },
      success(msg, opts) {
        return this[options.method](msg, 'success', opts);
      },
    };

    Vue.mixin({
      methods: {
        [options.method](msg, type, opts) {
          if (arguments.length > 0) {
            return new FlashMessage(FlashBus, msg, type, opts, options.messageOptions);
          }
          return FlashBus;
        },
        ...shortcuts,
      },
    });

    Vue.prototype[options.storage] = FlashBus;

    Vue.component(options.name, FlashMessageComponent(options, FlashBus));
  }
}


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MyPlugin)
}