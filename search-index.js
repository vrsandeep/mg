crystal_doc_search_index_callback({"repository_name":"mg","body":"# MG\n\nA minimal database migration tool for Crystal.\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n```yaml\ndependencies:\n mg:\n   github: hkalexling/mg\n```\n\n2. Run `shards install`\n\n## Usage\n\nFirst define some database versions by inheriting from `MG::Base`. Here are two examples:\n\n```crystal\n# migration/users.1.cr\nclass CreateUser < MG::Base\n  def up : String\n    <<-SQL\n    CREATE TABLE users (\n     username TEXT NOT NULL,\n     password TEXT NOT NULL,\n     email TEXT NOT NULL\n    );\n    SQL\n  end\n\n  def down : String\n    <<-SQL\n    DROP TABLE users;\n    SQL\n  end\nend\n```\n\n```crystal\n# migration/users_index.2.cr\nclass UserIndex < MG::Base\n  def up : String\n    <<-SQL\n    CREATE UNIQUE INDEX username_idx ON users (username);\n    CREATE UNIQUE INDEX email_idx ON users (email);\n    SQL\n  end\n\n  def down : String\n    <<-SQL\n    DROP INDEX username_idx;\n    DROP INDEX email_idx;\n    SQL\n  end\nend\n```\n\nNote that the migration files must be named as `[filename].[non-negative-version-number].cr`.\n\nNow require the relevant files and the migrations in your application code, and start the migration.\n\n```crystal\nrequire \"mg\"\nrequire \"sqlite3\"\nrequire \"./migration/*\"\n\nLog.setup \"mg\", :debug\nDB.open \"sqlite3://file.db\" do |db|\n  mg = MG::Migration.new db\n\n  # Migrates to the latest version (in our case, 2)\n  mg.migrate\n\n  # Migrates to a specific version\n  mg.migrate to: 1\n\n  # Migrates down to version 0\n  mg.migrate to: 0\n\n  # Returns the current version\n  puts mg.user_version # 0\nend\n```\n\n## Contributors\n\n- [Alex Ling](https://github.com/hkalexling) - creator and maintainer\n","program":{"html_id":"mg/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"mg","program":true,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"mg/MG","path":"MG.html","kind":"module","full_name":"MG","name":"MG","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/mg.cr","line_number":3,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg.cr#L3"},{"filename":"src/mg/base.cr","line_number":1,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/base.cr#L1"},{"filename":"src/mg/migration.cr","line_number":3,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/migration.cr#L3"},{"filename":"src/mg/types.cr","line_number":1,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/types.cr#L1"},{"filename":"src/mg/version.cr","line_number":1,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/version.cr#L1"}],"repository_name":"mg","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[{"id":"Log","name":"Log","value":"::Log.for(self)","doc":null,"summary":null},{"id":"VERSION","name":"VERSION","value":"\"0.1.0\"","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"mg/MG/Base","path":"MG/Base.html","kind":"class","full_name":"MG::Base","name":"Base","abstract":true,"superclass":{"html_id":"mg/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"mg/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"mg/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/mg/base.cr","line_number":24,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/base.cr#L24"}],"repository_name":"mg","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"mg/MG","kind":"module","full_name":"MG","name":"MG"},"doc":"All user defined versions must inherite from this class, and implement the `up` and `down` methods.\n\n```\nclass CreateUser < MG::Base\n  def up : String\n    <<-SQL\n    CREATE TABLE users (\n      username TEXT NOT NULL,\n      password TEXT NOT NULL,\n      email TEXT NOT NULL\n    );\n    CREATE UNIQUE INDEX user_idx ON users (username);\n    SQL\n  end\n\n  def down : String\n    <<-SQL\n    DROP TABLE users;\n    SQL\n  end\nend\n```","summary":"<p>All user defined versions must inherite from this class, and implement the <code>up</code> and <code>down</code> methods.</p>","class_methods":[{"id":"versions:Array(Version)-class-method","html_id":"versions:Array(Version)-class-method","name":"versions","doc":"Lists all versions available. The versions are sorted by version number.","summary":"<p>Lists all versions available.</p>","abstract":false,"args":[],"args_string":" : Array(Version)","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/base.cr#L48","def":{"name":"versions","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"Array(Version)","visibility":"Public","body":"versions = [] of Version\nversions << (Version.new(\"BaseVersion\", 0, \"\", \"\"))\n{% for sc in @type.subclasses %}\n        mg = {{ sc.id }}.new\n        tags = [] of String\n        {% if anno = sc.annotation(Tags) %}\n          {% for tag in anno.args %}\n            tags << {{ tag }}\n          {% end %}\n        {% end %}\n        versions << Version.new \"#{{{ sc }}}\", mg.version, mg.up, mg.down, tags\n      {% end %}\nversions.sort_by(&.version)\n"}}],"constructors":[],"instance_methods":[],"macros":[],"types":[]},{"html_id":"mg/MG/FilenameError","path":"MG/FilenameError.html","kind":"class","full_name":"MG::FilenameError","name":"FilenameError","abstract":false,"superclass":{"html_id":"mg/Exception","kind":"class","full_name":"Exception","name":"Exception"},"ancestors":[{"html_id":"mg/Exception","kind":"class","full_name":"Exception","name":"Exception"},{"html_id":"mg/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"mg/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/mg/types.cr","line_number":2,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/types.cr#L2"}],"repository_name":"mg","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"mg/MG","kind":"module","full_name":"MG","name":"MG"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]},{"html_id":"mg/MG/Migration","path":"MG/Migration.html","kind":"class","full_name":"MG::Migration","name":"Migration","abstract":false,"superclass":{"html_id":"mg/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"mg/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"mg/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/mg/migration.cr","line_number":4,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/migration.cr#L4"}],"repository_name":"mg","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"mg/MG","kind":"module","full_name":"MG","name":"MG"},"doc":null,"summary":null,"class_methods":[],"constructors":[{"id":"new(db:DB::Database,*,tag:String?=nil,version_table=&quot;mg_version&quot;,version_column=&quot;mg_version&quot;)-class-method","html_id":"new(db:DB::Database,*,tag:String?=nil,version_table=&quot;mg_version&quot;,version_column=&quot;mg_version&quot;)-class-method","name":"new","doc":"Instantiates a `Migration` object to migrate a DB.\n\n- *tag*: See `Tags`.\n- *version_table*: The name of the table to create to store the current schema version\n- *version_column*: The column in *version_table* that stores the current schema version\n\nNOTE: In SQLite, *version_table* and *version_column* are ignored, because we can use the built-in `user_version` pragma to store the version.","summary":"<p>Instantiates a <code><a href=\"../MG/Migration.html\">Migration</a></code> object to migrate a DB.</p>","abstract":false,"args":[{"name":"db","doc":null,"default_value":"","external_name":"db","restriction":"DB::Database"},{"name":"","doc":null,"default_value":"","external_name":"","restriction":""},{"name":"tag","doc":null,"default_value":"nil","external_name":"tag","restriction":"String | ::Nil"},{"name":"version_table","doc":null,"default_value":"\"mg_version\"","external_name":"version_table","restriction":""},{"name":"version_column","doc":null,"default_value":"\"mg_version\"","external_name":"version_column","restriction":""}],"args_string":"(db : DB::Database, *, tag : String? = <span class=\"n\">nil</span>, version_table = <span class=\"s\">&quot;mg_version&quot;</span>, version_column = <span class=\"s\">&quot;mg_version&quot;</span>)","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/migration.cr#L12","def":{"name":"new","args":[{"name":"db","doc":null,"default_value":"","external_name":"db","restriction":"DB::Database"},{"name":"","doc":null,"default_value":"","external_name":"","restriction":""},{"name":"tag","doc":null,"default_value":"nil","external_name":"tag","restriction":"String | ::Nil"},{"name":"version_table","doc":null,"default_value":"\"mg_version\"","external_name":"version_table","restriction":""},{"name":"version_column","doc":null,"default_value":"\"mg_version\"","external_name":"version_column","restriction":""}],"double_splat":null,"splat_index":1,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize(db, tag: tag, version_table: version_table, version_column: version_column)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"migrate(*,to:Int32=-1)-instance-method","html_id":"migrate(*,to:Int32=-1)-instance-method","name":"migrate","doc":"Migrates to a specific version. When `to` is negative, migrates to the\n  latest version available","summary":"<p>Migrates to a specific version.</p>","abstract":false,"args":[{"name":"","doc":null,"default_value":"","external_name":"","restriction":""},{"name":"to","doc":null,"default_value":"-1","external_name":"to","restriction":"Int32"}],"args_string":"(*, to : Int32 = <span class=\"n\">-1</span>)","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/migration.cr#L86","def":{"name":"migrate","args":[{"name":"","doc":null,"default_value":"","external_name":"","restriction":""},{"name":"to","doc":null,"default_value":"-1","external_name":"to","restriction":"Int32"}],"double_splat":null,"splat_index":0,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"if to < 0\n  if versions.empty?\n    Log.info do\n      \"No version found\"\n    end\n    return\n  end\n  to = versions.last.version\nend\nif get_version(to)\nelse\n  raise(VersionError.new(\"The target version #{to} does not exist in the versions list\"))\nend\nLog.info do\n  \"Current version: #{user_version}\"\nend\nLog.info do\n  \"Target version: #{to}\"\nend\nif to == user_version\n  Log.info do\n    \"Nothing to be done\"\n  end\n  return\nend\nis_up = to > user_version\nwhile !(user_version == to)\n  cur_ver = get_version(user_version)\n  if cur_ver\n  else\n    raise(VersionError.new(\"The current version #{user_version} does not exist in the versions list\"))\n  end\n  target = if is_up\n    (next_version(user_version)).not_nil!\n  else\n    (prev_version(user_version)).not_nil!\n  end\n  Log.info do\n    \"Migrating to #{target.name} (#{target.version})\"\n  end\n  @db.transaction do |tran|\n    conn = tran.connection\n    statements = is_up ? target.up_statements : cur_ver.down_statements\n    statements.each do |query|\n      conn.exec(query)\n      Log.debug do\n        \"Executing query:\\n#{query}\"\n      end\n    end\n  end\n  self.user_version = target.version\nend\nLog.info do\n  \"Job done\"\nend\n"}},{"id":"user_version-instance-method","html_id":"user_version-instance-method","name":"user_version","doc":"Returns the current schema version.","summary":"<p>Returns the current schema version.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/migration.cr#L62","def":{"name":"user_version","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"begin\n  @db.query_one(\"PRAGMA user_version\", as: Int32)\nrescue\n  use_version_table\n  query = \"SELECT #{@version_column}\\nFROM #{@version_table}\\nLIMIT 1\"\n  @db.query_one(query, as: Int32)\nend"}},{"id":"versions-instance-method","html_id":"versions-instance-method","name":"versions","doc":"Lists the available versions for the current migration.","summary":"<p>Lists the available versions for the current migration.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/migration.cr#L22","def":{"name":"versions","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"Base.versions.select do |v|\n  if @tag.nil?\n    v.tags.empty?\n  else\n    (v.version == 0) || (v.tags.includes?(@tag))\n  end\nend"}}],"macros":[],"types":[]},{"html_id":"mg/MG/Tags","path":"MG/Tags.html","kind":"annotation","full_name":"MG::Tags","name":"Tags","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/mg/types.cr","line_number":32,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/types.cr#L32"}],"repository_name":"mg","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"mg/MG","kind":"module","full_name":"MG","name":"MG"},"doc":"You can tag a subclass of `Base` using this annotatation.\n\nFor example, the following version will only be visible in `Migration`s instantiated with the tag \"prod\" or \"dev1\"\".\n```\n@[MG::Tags(\"prod\", \"dev1\")]\nclass MyVersion < MG::Base\n  # ...\nend\n\nDB.open \"sqlite://file.db\" do |db|\n  mg = MG::Migration.new db\n  mg.versions # Does not include `MyVersion` we defined above\nend\n\nDB.open \"sqlite://file.db\" do |db|\n  mg = MG::Migration.new db, tag: \"prod\"\n  mg.versions # This includes `MyVersion`\nend\n\nDB.open \"sqlite://file.db\" do |db|\n  mg = MG::Migration.new db, tag: \"dev1\"\n  mg.versions # This includes `MyVersion`\nend\n```","summary":"<p>You can tag a subclass of <code><a href=\"../MG/Base.html\">Base</a></code> using this annotatation.</p>","class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]},{"html_id":"mg/MG/Version","path":"MG/Version.html","kind":"struct","full_name":"MG::Version","name":"Version","abstract":false,"superclass":{"html_id":"mg/Struct","kind":"struct","full_name":"Struct","name":"Struct"},"ancestors":[{"html_id":"mg/Struct","kind":"struct","full_name":"Struct","name":"Struct"},{"html_id":"mg/Value","kind":"struct","full_name":"Value","name":"Value"},{"html_id":"mg/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/mg/version.cr","line_number":2,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/version.cr#L2"}],"repository_name":"mg","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"mg/MG","kind":"module","full_name":"MG","name":"MG"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[{"id":"down_statements-instance-method","html_id":"down_statements-instance-method","name":"down_statements","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/version.cr#L37","def":{"name":"down_statements","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"split_statements(@down)"}},{"id":"name:String-instance-method","html_id":"name:String-instance-method","name":"name","doc":null,"summary":null,"abstract":false,"args":[],"args_string":" : String","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/version.cr#L3","def":{"name":"name","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"String","visibility":"Public","body":"@name"}},{"id":"tags:Array(String)-instance-method","html_id":"tags:Array(String)-instance-method","name":"tags","doc":null,"summary":null,"abstract":false,"args":[],"args_string":" : Array(String)","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/version.cr#L5","def":{"name":"tags","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"Array(String)","visibility":"Public","body":"@tags"}},{"id":"up_statements-instance-method","html_id":"up_statements-instance-method","name":"up_statements","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/version.cr#L33","def":{"name":"up_statements","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"split_statements(@up)"}},{"id":"version:Int32-instance-method","html_id":"version:Int32-instance-method","name":"version","doc":null,"summary":null,"abstract":false,"args":[],"args_string":" : Int32","source_link":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/version.cr#L4","def":{"name":"version","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"Int32","visibility":"Public","body":"@version"}}],"macros":[],"types":[]},{"html_id":"mg/MG/VersionError","path":"MG/VersionError.html","kind":"class","full_name":"MG::VersionError","name":"VersionError","abstract":false,"superclass":{"html_id":"mg/Exception","kind":"class","full_name":"Exception","name":"Exception"},"ancestors":[{"html_id":"mg/Exception","kind":"class","full_name":"Exception","name":"Exception"},{"html_id":"mg/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"mg/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/mg/types.cr","line_number":5,"url":"https://github.com/hkalexling/mg/blob/19c2f5f0e22473e638871f6eaa041bf1223fdf93/src/mg/types.cr#L5"}],"repository_name":"mg","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"mg/MG","kind":"module","full_name":"MG","name":"MG"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]}]}]}})