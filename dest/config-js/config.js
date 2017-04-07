let CONFIG_JS = {
    path: null
};

let Configuration = function(id){
    this.id = id;
    this.selected_data;
    this.whole_data;
    this.template_select_uri = 'select.html';
};

Configuration.prototype.promiseLoadTemplate = function(json_uri){
    
    let dfd = new $.Deferred();
    
    $(this.id).load( CONFIG_JS.path + '/' + this.template_select_uri, dfd.resolve );
    
    dfd
    .then(
        () => { return $.getJSON( json_uri ); }
    )
    .then(
        
        (data) => {
            
            // tags in template
            let tag_title = this.id + ' [data-config-tag="title"]';
            let tag_configs = this.id + ' select[data-config-tag="configs"]';
            
            // save whole configuration
            this.whole_data = data;
            
            // set the title of panel by the title specified in configuration file
            $(tag_title).text(this.whole_data['title'])
            
            // build selection
            for(let o of Object.keys(this.whole_data['configs']) ){

                $(tag_configs).append('<option>' + o + '</option>');
            }

            // set data of default selected option
            this.selected_data = this.whole_data.configs[$(tag_configs + ' option:selected').text()];
            // set handler triggered by changing select option
            $(tag_configs).change(
                ()=>{
                    this.selected_data = this.whole_data.configs[$(tag_configs + ' option:selected').text()];
                });
                
        },
        
        // on error
        (p1,p2,p3)=>{
            console.log(p3.message);
        }
        
    );

    return dfd.promise();
    
};
