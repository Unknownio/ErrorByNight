@echo off
echo Type here in this terminal: diskpart
echo Type: list disk
echo Type: select disk (select which one you want to format)
echo Type: clean (this will delete the whole disk)
echo Type: create partition primary (it will make the disk raw, but it won't be accessible)
echo Type: format fs=ntfs (it will make the disk ntfs, but if you want fat32, then type "format fs=fat32")
echo Type: assign letter= (just add your own letter; remember that it must be new and unused)
echo Type: And now it's ready for use, Enjoy :)
echo                                          Faster option/Recommended for faster format
echo Type  here in this terminal: diskpart
echo Type: list disk
echo Type: select disk (select which one you want to format)
echo Type: clean 
echo Type: create partition primary
echo Type: assign letter= (just add your own letter; remember that it must be new and unused)
echo Type: "chkdsk (the letter of the disk u gave it):/f" or it will pop up with a window that says: you need to format the disk in drive (name of the disk):before you can use it. Do you want to format it? you can press Format disk
echo if you chose the secound option then before you press format , please change Allocated unit size to: Default allocation size
cmd


