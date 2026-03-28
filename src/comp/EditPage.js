"use client";

import { React, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';


import Call from './Call';
import Story from './Story';
import { fetchProfileById } from '../store/store'; // تأكد من استيراد الـ thunk
import Camera from './CameraIcon'
import Edit from './Edit'
import Plus from './Plus'
import Save from './Save'
import Loading from './Loading';
import imageCompression from 'browser-image-compression';
import {
  FaFacebookSquare, FaInstagram, FaWhatsapp, FaTelegramPlane, FaLinkedin,
  FaPhoneAlt, FaEnvelope, FaTwitter, FaYoutube, FaTiktok, FaSnapchat
} from "react-icons/fa";
import { MdDeleteForever, MdLogout } from "react-icons/md";
import 'quill/dist/quill.snow.css'; // ضروري جداً لظهور لوحة الألوان
import { Editor } from 'primereact/editor';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '../lib/constants';
import { ICON_ASSETS } from '../lib/assets';

const SEOHead = () => null;

const linkStyles = {
  facebook: {
    icon: <FaFacebookSquare size={65} />,
    style: { backgroundColor: '#fff', color: '#1877F2' },
  },
  instagram: {
    icon: <FaInstagram size={50} />,
    style: { backgroundColor: '#E4405F', color: 'white' },
  },
  whatsapp: {
    icon: <FaWhatsapp size={50} />,
    style: { backgroundColor: '#25D366', color: 'white' },
  },
  telegram: {
    icon: <FaTelegramPlane size={45} />,
    style: { backgroundColor: '#2AABEE', color: 'white' },
  },
  linkedin: {
    icon: <FaLinkedin size={50} />,
    style: { backgroundColor: '#0A66C2', color: 'white' },
  },
  twitter: {
    icon: <FaTwitter size={50} />,
    style: { backgroundColor: '#1DA1F2', color: 'white' },
  },
  youtube: {
    icon: <FaYoutube size={50} />,
    style: { backgroundColor: '#FF0000', color: 'white' },
  },
  tiktok: {
    icon: <FaTiktok size={50} />,
    style: { backgroundColor: '#010101', color: 'white' },
  },
  snapchat: {
    icon: <FaSnapchat size={50} />,
    style: { backgroundColor: '#FFFC00', color: 'black' }, // لون سناب شات يتطلب أيقونة سوداء
  },
  phone: {
    icon: <FaPhoneAlt size={30} />,
    style: { backgroundColor: '#34B7F1', color: 'white' },
  },
  email: {
    icon: <FaEnvelope size={50} />,
    style: { backgroundColor: '#EA4335', color: 'white' },
  },
};


function EditPage() {
  const router = useRouter();
  const navigate = (href) => router.push(href);
  const dispatch = useDispatch();
  //fetching data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // management tools
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  //for edit
  const [isAddLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({ type: 'facebook', url: '' });
  const [code, setCode] = useState('+20');
  const [imageToCrop, setImageToCrop] = useState(null);
  const cropperInstanceRef = useRef(null);
  const imageElementRef = useRef(null);
  const fileInputRef = useRef(null);
  const storyImageInputRef = useRef(null);
  const pbRef = useRef(null);
  const [editingStory, setEditingStory] = useState(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);




  // for get data ,formed it and save 
  useEffect(() => {
    const init = async () => {
      try {

        pbRef.current = new PocketBase(POCKETBASE_URL);
        const unsubscribe = pbRef.current.authStore.onChange((token, model) => {
          if (model) {
            const userId = model.id;
            setError(null);
            dispatch(fetchProfileById(userId));
            pbRef.current.collection('user').getOne(userId, { expand: 'stories,regular_users_stories' })
              .then(record => {
                setProfileData(record);
              })
              .catch(err => {
                setError("فشل جلب بيانات المستخدم.");
                console.error(err);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            setLoading(false);
            setError("المستخدم غير مسجل.");
          }
        }, true);

        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
          unsubscribe();
        };
      } catch (e) {
        setError("فشل تحميل المكتبات الأساسية.");
        console.error(e);
      }
    };
    init();
  }, [dispatch]);

  useEffect(() => {
    if (imageToCrop && imageElementRef.current) {
      if (cropperInstanceRef.current) cropperInstanceRef.current.destroy();

      cropperInstanceRef.current = new window.Cropper(imageElementRef.current,
        {
          aspectRatio: 1,
          viewMode: 1,
          background: false,
          responsive: true,
          autoCrop: true, // ✅ التعديل الصحيح
          checkOrientation: false,
          autoCropArea: 1,
        });
    }
    return () => { if (cropperInstanceRef.current) cropperInstanceRef.current.destroy(); };

  }, [imageToCrop]);

  const handleEditToggle = () => {
    if (!isEditing) {
      const transformedData = {
        id: profileData.id,
        avatar: profileData.Avatar ? pbRef.current.files.getURL(profileData, profileData.Avatar) : '',
        name: profileData.Name || '',
        job: profileData.job || '',
        bio: profileData.Bio || '',
        email: profileData.email || '',
        links: profileData.social_links || [],
        stories: profileData.expand?.stories?.map(s => ({
          id: s.id,
          name: s.Product_name,
          collectionName: s.collectionName,
          description: s.Product_description,
          link: s.Product_link,
          img: s.Product_img ? pbRef.current.files.getURL(s, s.Product_img) : ''
        })) || []
      };
      setEditData(transformedData);
    }
    setIsEditing(!isEditing);
  };
  // في ملف EditPage.js
  const handleSave = async () => {
    if (!editData) return;

    const formData = new FormData();
    formData.append('Name', editData.name);
    formData.append('job', editData.job);
    formData.append('Bio', editData.bio);
    formData.append('description', editData.description);
    formData.append('social_links', JSON.stringify(editData.links));
    if (editData.avatarFile) {
      formData.append('Avatar', editData.avatarFile);
    }
    const storyIds = editData.stories.map(story => story.id);
    storyIds.forEach(id => {
      formData.append('stories', id);
    });
    if (storyIds.length === 0) {
      formData.append('stories', '');
    }

    try {

      const updatedRecord = await pbRef.current.collection('User').update(editData.id, formData);
      alert("تم حفظ التغييرات بنجاح!");
      setProfileData(updatedRecord);
      setIsEditing(false);

    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("فشل حفظ التغييرات. راجع الـ console لمزيد من التفاصيل.");
    }
  };
  const handlePrimaryLinkChange = (type, value) => {
    setEditData(prevData => {
      const links = [...(prevData.links || [])];
      const existingLinkIndex = links.findIndex(link => link.type === type);
      if (existingLinkIndex > -1) {
        links[existingLinkIndex].url = value;
      } else if (value) {
        links.push({ type: type, url: value });
      }
      const finalLinks = links.filter(l => l.url && l.url.trim() !== '');
      return { ...prevData, links: finalLinks };
    });
  };
  const handleInputChange = (e) => setEditData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    console.log(`حجم الصورة الأصلي: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const options = {
      maxSizeMB: 1,          // الحجم الأقصى للملف بعد الضغط (هنا 1 ميجابايت)
      maxWidthOrHeight: 1024, // أقصى عرض أو ارتفاع للصورة
      useWebWorker: true     // استخدام Web Worker لتسريع العملية ومنع تجميد الواجهة
    }
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`حجم الصورة بعد الضغط: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      setEditData(p => ({ ...p, avatarFile: compressedFile }));
      setImageToCrop(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('حدث خطأ أثناء ضغط الصورة:', error);
      setEditData(p => ({ ...p, avatarFile: file }));
      setImageToCrop(URL.createObjectURL(file));
    }
  };

  const handleCrop = () => {
    if (cropperInstanceRef.current) {
      const croppedCanvas = cropperInstanceRef.current.getCroppedCanvas({
        maxWidth: 1024,
        maxHeight: 1024,
        imageSmoothingQuality: 'high',
      });
      croppedCanvas.toBlob((blob) => {
        if (!blob) {
          console.error('خطأ في قص الصورة');
          return;
        }
        const croppedFile = new File([blob], "avatar.jpeg", { type: "image/jpeg" });
        setEditData(p => ({
          ...p,
          avatarFile: croppedFile, // الملف الذي سيتم رفعه
          avatar: URL.createObjectURL(croppedFile) // رابط مؤقت لعرض الصورة في الصفحة
        }));
        setImageToCrop(null);
      }, 'image/jpeg', 0.9);
    }
  };
  const handleRemoveLink = (indexToRemove) => setEditData(p => ({ ...p, links: p.links.filter((_, i) => i !== indexToRemove) }));
  const handleOpenAddLinkModal = () => {
    setNewLink({ type: 'facebook', url: '' });
    setAddLinkModalOpen(true);
  };
  const handleSaveNewLink = () => {
    if (newLink.url) setEditData(p => ({ ...p, links: [...p.links, newLink] }));
    if (newLink.type === 'telegram' || newLink.type === 'whatsapp' || newLink.type === 'phone') setEditData(p => ({ ...p, links: [...p.links, newLink.url = code + newLink.url] }));
    setAddLinkModalOpen(false);
  };

  const handleOpenStoryModal = (story, index) => {
    setEditingStory({ ...story, index }); // نفتح النافذة مع بيانات القصة وموقعها
  };
  const handleSaveStory = async () => {
    if (!editingStory) return;
    // --- التحقق من نوع المستخدم وتحديد المجموعة المستهدفة ---
    let targetCollection;
    if (profileData && profileData.is_vip === true) {
      targetCollection = 'stories'; // إذا كان المستخدم VIP
    } else {
      targetCollection = 'regular_users_stories'; // إذا كان المستخدم عاديًا
    }
    const formData = new FormData();
    formData.append('Product_name', editingStory.name);
    formData.append('Product_description', editingStory.description);
    formData.append('Product_link', editingStory.link);

    if (editingStory.newImageFile) {
      formData.append('Product_img', editingStory.newImageFile);
    }
    try {
      if (editingStory.id && !editingStory.id.startsWith('new-')) {
        // ------ تعديل قصة موجودة ------
        const originalCollection = editingStory.collectionName || targetCollection;
        const updatedStory = await pbRef.current.collection(originalCollection).update(editingStory.id, formData);

        // تحديث القصة في الحالة المحلية (local state)
        const updatedStories = editData.stories.map(story =>
          story.id === updatedStory.id ? { ...story, ...updatedStory, name: updatedStory.Product_name, description: updatedStory.Product_description, link: updatedStory.Product_link } : story
        );
        setEditData(p => ({ ...p, stories: updatedStories }));
      } else {
        // ------ إضافة قصة جديدة ------
        const newStory = await pbRef.current.collection(targetCollection).create(formData);
        const newStoryFormatted = { ...newStory, name: newStory.Product_name, description: newStory.Product_description, link: newStory.Product_link };
        setEditData(p => ({ ...p, stories: [...p.stories, newStoryFormatted] }));
      }
      setEditingStory(null);
      alert("تم حفظ القصة بنجاح!");
    } catch (error) {
      console.error("فشل حفظ القصة:", error);
      alert("حدث خطأ أثناء حفظ القصة.");
    }
  };
  const handleStoryInputChange = (e) => {
    setEditingStory(p => ({ ...p, [e.target.name]: e.target.value, [e.target.link]: e.target.value }));
  };

  const handleRemoveStory = async (storyId, indexToRemove) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه القصة؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }
    const originalStories = [...editData.stories];
    const updatedStories = originalStories.filter((_, i) => i !== indexToRemove);

    setEditData(p => ({ ...p, stories: updatedStories }));

    try {
      const targetCollection = updatedStories.collectionName;
      if (targetCollection) {
        await pbRef.current.collection(targetCollection).delete(storyId);
      }

      alert("تم حذف القصة بنجاح.");
    } catch (error) {
      console.error("فشل حذف القصة:", error);
      alert("حدث خطأ أثناء حذف القصة من قاعدة البيانات.");
      setEditData(p => ({ ...p, stories: originalStories }));
    }
  };
  const handleStoryImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    console.log(`حجم صورة القصة الأصلي: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`حجم صورة القصة بعد الضغط: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      setEditingStory(p => ({
        ...p,
        newImageFile: compressedFile,
        img: URL.createObjectURL(compressedFile)
      }));

    } catch (error) {
      console.error('حدث خطأ أثناء ضغط صورة القصة:', error);
      setEditingStory(p => ({
        ...p,
        newImageFile: file,
        img: URL.createObjectURL(file)
      }));
    }
  };
  const handleLogout = () => {
    if (pbRef.current) {
      pbRef.current.authStore.clear(); // مسح بيانات الجلسة
      navigate('/login'); // الانتقال لصفحة تسجيل الدخول
    }
  };
  if (loading) return <Loading />
  if (error) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}><h1>خطأ: {error}</h1></div>;
  if (!profileData) return <Loading />;



  const allStories = [
    ...(profileData.expand?.stories ?? []),
    ...(profileData.expand?.regular_users_stories ?? [])
  ];
  const userData = isEditing ? editData : {
    id: profileData.id,
    name: profileData.Name || '',
    avatar: profileData.Avatar ? pbRef.current.files.getURL(profileData, profileData.Avatar) : '',
    job: profileData.job || '',
    bio: profileData.Bio || '',
    email: profileData.email || '',
    links: profileData.social_links || [],
    stories: allStories.map(s => ({
      id: s.id,
      name: s.Product_name,
      collectionName: s.collectionName,
      description: s.Product_description,
      link: s.Product_link,
      img: s.Product_img ? pbRef.current.files.getURL(s, s.Product_img) : ''
    })) || []
  };

  //تنسق ال tool bar 
  const renderHeader = () => {
    return (
      <span className="ql-formats">
        {/* التنسيقات الأساسية */}
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>

        {/* إضافة زر اتجاه النص (RTL/LTR) */}
        <span className="ql-formats">
          <button className="ql-direction" value="rtl"></button>
        </span>

        {/* أزرار المحاذاة */}
        <span className="ql-formats">
          <button className="ql-align" value=""></button>      {/* محاذاة لليسار */}
          <button className="ql-align" value="center"></button> {/* محاذاة للوسط */}
          <button className="ql-align" value="right"></button>  {/* محاذاة لليمين */}
          <button className="ql-align" value="justify"></button>{/* ضبط السطور */}
        </span>

        {/* الألوان والقوائم */}
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>

        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-clean" aria-label="Remove Styles"></button>
        </span>
      </span>
    );
  };

  const header = renderHeader();




  const phoneNumber = userData.links.find(link => link.type === 'phone')?.url || '';
  const emailAddress = userData.links.find(link => link.type === 'email')?.url || '';
  console.log(profileData)
  if (!userData) return <Loading />;
  return (
    <>
      <SEOHead
        title="لوحة التحكم"
        description="إدارة الملف الشخصي والروابط والأعمال الخاصة ببطاقة Waves NFC."
        image="/logo.png"
        slug="edit"
        noIndex={true}
      />
      <div className='nfcPage'>
        <div className='productsSec'>
          <div className="card">
            <div className='userData'>
              <div className='imgHolder'>
                <img src={userData.avatar || '/logo.png'} className="card-img-top" alt={userData.name} />
                {isEditing && (
                  <button onClick={() => fileInputRef.current.click()} className='camera absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600'>
                    <Camera size={20} className='cameraIcon' />
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className=" visually-hidden" accept="image/*" />
              </div>
              {isEditing ? (
                <div className='editingInput'>
                  <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="textInput" placeholder="الاسم" />
                  <input type="text" name="job" value={editData.job} onChange={handleInputChange} className="textInput" placeholder="الوظيفة" />



                  <Editor value={editData.bio}
                    onTextChange={(e) => setEditData(prev => ({ ...prev, bio: e.htmlValue }))}
                    headerTemplate={header}
                    maxLength={500}

                    style={{
                      height: '320px',
                      textDecoration: 'rtl',
                    }}

                  />


                  {/* ///<textarea resize='false' name="bio" maxLength={500} value={editData.bio} onChange={handleInputChange} className="textareaInput" rows="10" placeholder="الوصف"></textarea> */}
                </div>
              ) : (
                <>
                  <div className='nameHolder'>
                    <h1 className='text-2xl font-bold'>{userData.name}</h1>
                    <button onClick={handleEditToggle} className='edit text-gray-500 hover:text-blue-500'>
                      <span className='editHight'></span>
                      <Edit size={18} />
                    </button>
                  </div>
                  <h4 style={{ fontSize: 'large' }}>{userData.job}</h4>
                  <h6 className='bioContainer'
                    style={{ fontSize: '1.25rem', lineHeight: '30px' }}
                    dangerouslySetInnerHTML={{ __html: userData.bio }}
                  />
                </>
              )}
            </div>
            {isEditing ? (
              <ul className="list-group list-group-flush social-icons-list">
                {editData.links
                  .filter(link => link.url && linkStyles[link.type])
                  .map((link, index) => {
                    const href = '#';
                    const iconStyle = linkStyles[link.type]?.style || {};
                    const IconComponent = linkStyles[link.type]?.icon || null;
                    return (
                      <li className="list-group-item social-icon-item editable" id={link.type} key={index}>
                        <a href={href} onClick={(e) => e.preventDefault()} title={link.type}>
                          <span className={`${link.type} social-icon-wrapper`} style={iconStyle}>
                            {IconComponent}
                          </span>
                        </a>
                        <button
                          className="delete-link-button"
                          onClick={() => handleRemoveLink(index)}
                          title="حذف الرابط"
                        >
                          <MdDeleteForever size={20} />
                        </button>
                      </li>
                    );
                  })}

                {isEditing && (
                  <li className="list-group-item">
                    <button onClick={handleOpenAddLinkModal} className="plusIcon">
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </li>
                )}
              </ul>
            ) : (
              <ul className="list-group list-group-flush social-icons-list">
                {userData.links
                  .filter(link => link.url && linkStyles.hasOwnProperty(link.type))
                  .map((link) => {
                    const href = link.type === 'whatsapp'
                      ? `https://wa.me/${link.url.replace(/\D/g, '')}`
                      : link.type === 'telegram'
                        ? `https://t.me/+${link.url.replace(/\D/g, '')}`
                        : link.url;

                    const iconStyle = linkStyles.hasOwnProperty(link.type) ? linkStyles?.[link.type]?.style : {};
                    const IconComponent = linkStyles.hasOwnProperty(link.type) ? linkStyles?.[link.type]?.icon : null;

                    return (
                      <li className="list-group-item social-icon-item" id={link.type} key={link.type}>
                        <a href={href} target="_blank" rel="noopener noreferrer" title={link.type}>
                          <span className={`${link.type} social-icon-wrapper `} style={iconStyle}>
                            {IconComponent}
                          </span>
                        </a>
                      </li>
                    );
                  })}

                {isEditing && (
                  <li className="list-group-item">
                    <button onClick={handleOpenAddLinkModal} className="plusIcon">
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </li>
                )}
              </ul>
            )}

            <div className='stories d-flex align-items-center flex-column'>
              <div className='stories p-4 space-y-4'>
                <h3 className="text-center font-bold text-lg border-b pb-2 mb-2">أعمالنا</h3>
                {isEditing ?
                  userData.stories.map((story, index) => (
                    <div key={index} className="w-full p-2 rounded-md flex items-center gap-4 relative">
                      {isEditing && (
                        <>
                          <div className="flex flex-col gap-2">
                            <Story key={index} discStory={story.description} linkTo={story.link} storyTittle={story.name}
                              editbtn={true} doThis={() => handleOpenStoryModal(story, index)}
                              deleteBtn={<button onClick={() =>
                                handleRemoveStory(story.id, index)} className="deletStory"> <MdDeleteForever /> delete </button>}
                              imgStory={story.img || 'https://placehold.co/100x100/EFEFEF/333333?text=?'} />
                          </div>
                        </>
                      )}
                    </div>
                  )) : userData.stories.map((story, index) => (
                    <div key={index} className="w-full p-2  rounded-md flex items-center gap-4 relative">
                      <Story key={index} discStory={story.description} linkTo={story.link}
                        storyTittle={story.name} editbtn={false}
                        imgStory={story.img || 'https://placehold.co/100x100/EFEFEF/333333?text=?'} />
                      {isEditing && (
                        <>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => handleOpenStoryModal(story, index)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                            <button onClick={() => handleRemoveStory(story.id, index)} className="text-red-500 hover:text-red-700">X</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                }
                {isEditing && (
                  <button onClick={() => handleOpenStoryModal({ name: '', description: '', img: '' }, -1)} className="w-full mt-2 text-white flex items-center justify-center addStoryBtn bg-primary">
                    <Plus size={20} /> إضافة عمل جديد
                  </button>
                )}
              </div>

            </div>
            {isEditing ?
              <>
                <h4 className="edit-section-title">معلومات التواصل الأساسية</h4>
                <Call telNo={phoneNumber} editMode={true}
                  func={(e) => handlePrimaryLinkChange('phone', e.target.value)}
                  editData={editData?.links?.find(l => l.type === 'phone')?.url || ''} />
                <span className="call gmail" id='whatsapp'>
                  <img src={ICON_ASSETS.email} alt='whatsapp' />
                  <input
                    type="email"
                    name="email"
                    className="emailInput"
                    placeholder="البريد الإلكتروني الأساسي"
                    value={editData?.links?.find(l => l.type === 'email')?.url || ''}
                    onChange={(e) => handlePrimaryLinkChange('email', e.target.value)}
                  />
                </span>

              </>
              : <>
                <Call telNo={phoneNumber} className="call gmail" />
                <span className="call gmail" id='whatsapp'>
                  <img src={ICON_ASSETS.email} alt='whatsapp' />
                  <p>Mail:
                    <a href={`mailto:${userData ? emailAddress
                      : 'example@gmail.com'}`}>{userData ? emailAddress : 'example@gmail.com'}</a></p>
                </span>
              </>
            }

            {isEditing ? (
              <div className='btnsEditor'>
                <div className="saveEdits">
                  <button onClick={handleSave} className="save"><Save size={18} /> حفظ</button>
                  <button onClick={handleEditToggle} className="cancel">X إلغاء</button>
                </div>
                <button onClick={handleLogout} className="login-submit">تسجيل الخروج <MdLogout size={20} /></button>
              </div>
            ) : <div className='btnsEditor'>
              <button onClick={handleLogout} className="login-submit" >تسجيل الخروج <MdLogout size={20} /></button>
            </div>}
          </div>

        </div>


        {imageToCrop && (
          <div className="cropImg">
            <div className="bg-white rounded-lg p-6 w-full max-w-md croper">
              <h2 className="text-2xl font-bold text-center mb-4">تعديل الصورة</h2>
              <div style={{ height: 300, width: '100%' }}>
                <img ref={imageElementRef} src={imageToCrop} style={{ maxWidth: '100%' }} alt="To Crop" />
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={handleCrop} className="save">قص وحفظ</button>
                <button onClick={() => setImageToCrop(null)} className="cancel">إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {isAddLinkModalOpen && (
          <div className="addLink">
            <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 addLinker">
              <h2 className="text-2xl font-bold text-center">إضافة رابط جديد</h2>
              <div className='socialIconSelector'>
                <label className="block text-sm font-medium text-gray-700">اختر المنصة</label>

                {/* الزر الذي يعرض الأيقونة المختارة ويفتح القائمة */}
                <button
                  type="button"
                  className="custom-select-button"
                  onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
                >
                  {linkStyles[newLink.type].icon}
                  <span>{newLink.type.charAt(0).toUpperCase() + newLink.type.slice(1)}</span>
                  <span className="arrow">{isIconSelectorOpen ? '▲' : '▼'}</span>
                </button>

                {/* القائمة المنسدلة المخصصة */}
                {isIconSelectorOpen && (
                  <div className="custom-select-options">
                    {Object.keys(linkStyles).map(type => (
                      <div
                        key={type}
                        className="custom-select-option"
                        onClick={() => {
                          setNewLink(p => ({ ...p, type: type }));
                          setIsIconSelectorOpen(false);
                        }}
                      >
                        {linkStyles[type].icon}
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='socialIconLink w-100'>
                <label className="block text-sm font-medium text-gray-700"> </label>
                {newLink.type === 'whatsapp' ?
                  <>
                    <select id='code' value={code} onChange={e => setCode(e.target.value)}>
                      <option value="+20" >+20</option>
                      <option value="+971" >+971</option>
                      <option value="+966">+966</option>
                    </select>
                    <input type="text" value={newLink.url} onChange={e => {
                      let phone = e.target.value
                      setNewLink(p => ({ ...p, url: phone }))
                    }}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter phone number " />
                  </>
                  : newLink.type === 'telegram' ?
                    <>
                      <select id='code' value={code} onChange={e => setCode(e.target.value)}>
                        <option value="+20" >+20</option>
                        <option value="+971" >+971</option>
                        <option value="+966">+966</option>
                      </select>
                      <input type="text" value={newLink.url} onChange={e => {
                        let phone = e.target.value
                        setNewLink(p => ({ ...p, url: phone }))
                      }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter phone number " />
                    </>
                    : newLink.type === 'phone' ? <input type="text" value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter phone number " />
                      : <input type="url" value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="https://example.com" />
                }
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={handleSaveNewLink} className="save">حفظ</button>
                <button onClick={() => setAddLinkModalOpen(false)} className="cancel">إلغاء</button>
              </div>
            </div>
          </div>
        )}
        {editingStory && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 editStoryHolder">
            <div className="bg-white w-full max-w-md space-y-4 p-5">
              <h2 className="text-2xl font-bold text-center">{editingStory.index > -1 ? 'تعديل العمل' : 'إضافة عمل جديد'}</h2>

              {/* --- إضافة: قسم تعديل صورة القصة --- */}
              <div className='d-flex align-content-center justify-content-center rounded-2'>
                <div className="relative w-full h-40 bg-gray-200 rounded-md flex items-center justify-center storyImgHolder">
                  <img src={editingStory.img || 'https://placehold.co/200x150/EFEFEF/333333?text=اختر+صورة'} style={{ maxWidth: '100%' }} alt="Preview" className="w-full h-full object-contain rounded-md" />
                  <button onClick={() => storyImageInputRef.current.click()} className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    <Camera size={18} className='cameraIcon' />
                  </button>
                  <input type="file" ref={storyImageInputRef} onChange={handleStoryImageChange} className="hidden" accept="image/*" />
                </div>
              </div>

              <div className='inputEditStory'>
                <input type="text" name="name" value={editingStory.name} onChange={handleStoryInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md textInput" placeholder="مثال : السي في الخاص بك" />
                <input type="text" name="link" value={editingStory.link} onChange={handleStoryInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md textInput text-start" placeholder="www.example.com : مثال" />
                <textarea name="description" value={editingStory.description} onChange={handleStoryInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md textareaInput" rows="3" placeholder="وصف الخاص للعمل"></textarea>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={handleSaveStory} className="save bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">حفظ</button>
                <button onClick={() => setEditingStory(null)} className="cancel bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditPage;
