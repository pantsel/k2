module.exports = {


  friendlyName: 'Create',


  description: 'Create kong connection.',


  inputs: {

    type: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    url: {
      type: 'string',
      required: true
    },

    apiKey: {
      type: 'string'
    },

    jwtIdentificationKey: {
      type: 'string'
    },

    jwtIdentificationKey: {
      type: 'string'
    },

    jwtSecret: {
      type: 'string'
    }
  },


  exits: {
    nameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided connection name is already in use.',
    },
  },


  fn: async function (inputs, exits) {

    let alreadyExistingConnection = await sails.models.kongconnection.findOne({name: inputs.name});
    if(alreadyExistingConnection) {
      throw 'nameAlreadyInUse';
    }

    let connection = await sails.models.kongconnection.create(_.merge(inputs,{
      createdBy: this.req.session.userId
    }))

    return exits.success(connection);

  }


};
