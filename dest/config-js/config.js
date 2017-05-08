let CONFIG_JS = {
    path: null,
    notice: true // GUI上で設定が選び直される度に、選ばれた設定の値をコンソール出力する。
};

let Configuration = function(id, json_uri = null){
    this.id = id;
    this.selected_data;
    this.whole_data;
    this.template_select_uri = 'select.html';

    // コンストラクタ呼び出し時に、jsonファイルが指定されていれば、読み込みを始める
    if(json_uri){
        this.promiseLoadTemplate(json_uri);
    }
};

Configuration.prototype.promiseLoadTemplate = function(json_uri){
    
    let dfd = new $.Deferred();
    
    $(this.id).load( CONFIG_JS.path + '/' + this.template_select_uri, dfd.resolve );
    
    dfd
    .then(
        () => { return $.getJSON( json_uri + '?' + Date.now() ); }
    )
    .done(
        
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

            // set handler triggered by changing select option
            let onChange = ()=>{
                // set data of default selected option
                this.selected_data = this.whole_data.configs[$(tag_configs + ' option:selected').text()];
                if( CONFIG_JS.notice === true ) console.log(tag_title,this.selected_data);
            };
            // Initially call once
            onChange();
            $(tag_configs).change(onChange);
                
        }
    )
    .fail(
        (p1,p2,p3)=>{
            console.log(p3.message);
        }
    );

    return dfd.promise();
    
};
