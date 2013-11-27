Todos.TodosController = Ember.ArrayController.extend({
  actions: {
    create: function () {
      var t = this.get('newTitle');
      if (!t.trim()) { return; }

      var todo = this.store.createRecord('todo', {
        title: t,
        isCompleted: false
      });

      this.set('newTitle','');

      todo.save();
    },
    clearCompleted: function () {
      var completed = this.filterBy('isCompleted', true);
      completed.invoke('deleteRecord');
      completed.invoke('save');
    }
  },

  allDone: function (k, v) {
    if (v === undefined) {
      return this.get('remaining') == 0;
    } else {
      this.setEach('isCompleted', v);
      this.invoke('save');
      return v;
    }
  }.property('remaining'),

  hasCompleted: function () {
    return this.get('completed') > 0;
  }.property('completed'),

  completed: function () {
    return this.filterBy('isCompleted', true).get('length');
  }.property('@each.isCompleted'),

  remaining: function () {
    return this.filterBy('isCompleted', false).get('length');
  }.property('@each.isCompleted'),

  inflection: function () {
    var remaining = this.get('remaining');
    return remaining === 1 ? 'todo' : 'todos';
  }.property('remaining')
});

Todos.TodoController = Ember.ObjectController.extend({
  actions: {
    edit: function () {
      this.set('isEditing', true);
    },
    update: function () {
      this.set('isEditing', false);

      if (Ember.isEmpty(this.get('model.title'))) {
        this.send('removeTodo');
      } else {
        this.get('model').save();
      }
    },
    delete: function () {
      var todo = this.get('model');
      todo.deleteRecord();
      todo.save();
    }
  },
  isEditing: false,
  isCompleted: function (key, value) {
    var model = this.get('model');
    // console.log(model)
    if (value === undefined) {
      return model.get('isCompleted');
    } else {
      model.set('isCompleted', value);
      model.save();
      return value;
    }
  }.property('model.isCompleted')
});