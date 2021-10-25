const { projectSchema } = require("../../../models/project");


class projectController {
    async index(req,res){
        try {
            let criteria={
                isDeleted:true
            }
            let project = await  projectSchema.find(req.params.id,criteria)
            return res.status(200).json({ success: true,data: project });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
  }
  async create(req,res){
      try {
          let payload={
              ...req.body
          }
          let project = new projectSchema(payload)
          await project.save()
          return res.status(200).json({success:true,data:project})
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
  }
  async show(req,res){
    try {
        let criteria={
            isDeleted:true
        }
        let project = await  projectSchema.findById(req.params.id,criteria)
        return res.status(200).json({success: true, data: project });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
async update(req,res){
    try {
        let project = await  projectSchema.findById(req.params.id)
        let payload={
            ...req.body
        }
        let updateProject= await projectSchema.findByIdAndUpdate(project,payload,{upsert:true,new:true})
        return res.status(200).json({ success: true, data: updateProject });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
async delete(req,res){
    try {
        let deleteData = await projectSchema.findOneAndUpdate({_id:req.params.id},{isDeleted:true},{upsert:true,new:true})
        return res.status(200).json({ success: true,data:[]} );
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}   
}

module.exports = new projectController();