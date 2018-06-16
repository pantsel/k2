
parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    dashboardModalVisible: false,

    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    createConnectionFormData: {
      type: 'basic',
      jwtAlgorithm: "HS256"
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `createConnectionFormData`.
    formErrors: {/* … */},

    // Server error state for the form
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    // this.$notify({
    //   group: 'app',
    //   title: 'Important message',
    //   text: 'Hello user! This is a notification!'
    // });
    this.$awn.success("Your custom message")
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    setConnectionType: function(type) {
      this.createConnectionFormData.type = type;
    },

    clickOpenDashboardModalButton: async function () {
      this.dashboardModalVisible = true;
    },

    closeDashboardModal: async function () {
      this.dashboardModalVisible = false;
    },

    submittedForm: async function () {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;
      window.location = '/';
    },

    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.createConnectionFormData;

      // Validate name:
      if (!argins.name) {
        this.formErrors.name = true;
      }

      // Validate email:
      if (!argins.url) {
        this.formErrors.url = true;
      }

      // Validate type:
      if (!argins.type) {
        this.formErrors.type = true;
      }

      switch (argins.type) {
        case "basic":
          break;
        case "key-auth":
          if (!argins.apiKey) {
            this.formErrors.apiKey = true;
          }
          break;
        case "jwt-auth":
          if (!argins.jwtIdentificationKey) {
            this.formErrors.jwtIdentificationKey = true;
          }
          if (!argins.jwtSecret) {
            this.formErrors.jwtSecret = true;
          }
          break;
        default:
          this.formErrors.type = true;
      }


      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }


      return argins;
    },

    parseCloudError() {
      switch (this.cloudError) {
        case "nameAlreadyInUse":
          return "The connection name is already in use. Please try another one."
        default:
          return "An unknown error has occurred."
      }
    }

  }
});
