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

const PRIMARY_CONTACT_TYPES = ['phone', 'email'];
const MANAGED_SOCIAL_TYPES = Object.keys(linkStyles).filter(type => !PRIMARY_CONTACT_TYPES.includes(type));

const EDIT_STEPS = [
  { title: 'البيانات الأساسية', description: 'غيّر الصورة والاسم والمسمى الوظيفي والنبذة.' },
  { title: 'التواصل', description: 'حدّث الهاتف والبريد ثم أضف روابط المنصات المهمة.' },
  { title: 'الأعمال', description: 'أضف نماذج أعمالك أو عدّلها ثم احفظ التغييرات.' },
];

const PRESET_STORY_IMAGES = [
  { id: 'google-maps', label: 'Google Maps', category: 'أماكن', src: '/preset-stories/google-maps.svg' },
  { id: 'instapay', label: 'InstaPay', category: 'مدفوعات', src: '/preset-stories/instapay.svg' },
  { id: 'vodafone-cash', label: 'Vodafone Cash', category: 'محافظ', src: '/preset-stories/vodafone-cash.svg' },
  { id: 'orange-cash', label: 'Orange Cash', category: 'محافظ', src: '/preset-stories/orange-cash.svg' },
  { id: 'etisalat-cash', label: 'Etisalat Cash', category: 'محافظ', src: '/preset-stories/etisalat-cash.svg' },
  { id: 'we-pay', label: 'WE Pay', category: 'محافظ', src: '/preset-stories/we-pay.svg' },
  { id: 'location', label: 'Location', category: 'أماكن', src: '/preset-stories/location.svg' },
  { id: 'store', label: 'Store', category: 'أعمال', src: '/preset-stories/store.svg' },
  { id: 'restaurant-menu', label: 'Restaurant Menu', category: 'مطاعم', src: '/preset-stories/restaurant-menu.svg' },
  { id: 'booking', label: 'Booking', category: 'حجوزات', src: '/preset-stories/booking.svg' },
  { id: 'portfolio', label: 'Portfolio', category: 'أعمال', src: '/preset-stories/portfolio.svg' },
  { id: 'delivery', label: 'Delivery', category: 'خدمات', src: '/preset-stories/delivery.svg' },
  { id: 'clinic', label: 'Clinic', category: 'خدمات', src: '/preset-stories/clinic.svg' },
  { id: 'real-estate', label: 'Real Estate', category: 'أماكن', src: '/preset-stories/real-estate.svg' },
  { id: 'cafe', label: 'Cafe', category: 'مطاعم', src: '/preset-stories/cafe.svg' },
  { id: 'website', label: 'Website', category: 'أعمال', src: '/preset-stories/website.svg' },
];


const ACCOUNT_FORM_DEFAULTS = {
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const USER_COLLECTION_NAMES = ['User', 'user', 'Users', 'users'];

const mapStoriesFromProfile = (profile, pbClient) => {
  const allStories = [
    ...(profile?.expand?.stories ?? []),
    ...(profile?.expand?.regular_users_stories ?? []),
  ];

  return allStories.map((story) => ({
    id: story.id,
    name: story.Product_name,
    collectionName: story.collectionName,
    description: story.Product_description,
    link: story.Product_link,
    img: story.Product_img ? pbClient.files.getURL(story, story.Product_img) : '',
  }));
};

const buildEditStateFromProfile = (profile, pbClient) => ({
  id: profile.id,
  avatar: profile.Avatar ? pbClient.files.getURL(profile, profile.Avatar) : '',
  name: profile.Name || '',
  job: profile.job || '',
  bio: profile.Bio || '',
  email: profile.email || '',
  links: profile.social_links || [],
  stories: mapStoriesFromProfile(profile, pbClient),
  visits: profile.visits,
  slug: profile.slug,
});

const buildAccountStateFromProfile = (profile) => ({
  ...ACCOUNT_FORM_DEFAULTS,
  username: profile?.username || '',
  email: profile?.email || '',
});

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
  const [openPresetCategory, setOpenPresetCategory] = useState(PRESET_STORY_IMAGES[0]?.category || '');
  const [activeTab, setActiveTab] = useState('profile');
  const [accountData, setAccountData] = useState(ACCOUNT_FORM_DEFAULTS);
  const [accountFeedback, setAccountFeedback] = useState(null);
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  function getUserCollectionNames() {
    return Array.from(
      new Set([
        pbRef.current?.authStore?.model?.collectionName,
        ...USER_COLLECTION_NAMES,
      ].filter(Boolean)),
    );
  }

  async function getUserRecord(userId, options = {}) {
    let lastError = null;

    for (const collectionName of getUserCollectionNames()) {
      try {
        return await pbRef.current.collection(collectionName).getOne(userId, {
          requestKey: null,
          ...options,
        });
      } catch (error) {
        lastError = error;

        if (error?.status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  }

  async function updateUserRecord(userId, data, options = {}) {
    let lastError = null;

    for (const collectionName of getUserCollectionNames()) {
      try {
        return await pbRef.current.collection(collectionName).update(userId, data, {
          requestKey: null,
          ...options,
        });
      } catch (error) {
        lastError = error;

        if (error?.status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  }
  // for get data ,formed it and save 
  useEffect(() => {
    const init = async () => {
      try {
        pbRef.current = new PocketBase(POCKETBASE_URL);
        pbRef.current.autoCancellation(false);
        const unsubscribe = pbRef.current.authStore.onChange((token, model) => {
          if (model) {
            const userId = model.id;
            setError(null);
            dispatch(fetchProfileById(userId));
            getUserRecord(userId, {
              expand: 'stories,regular_users_stories',
            })
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
          console.log(unsubscribe)
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

  useEffect(() => {
    if (profileData) {
      setAccountData(buildAccountStateFromProfile(profileData));
    }
  }, [profileData]);

  const loadProfile = async (userId) => {
    const record = await getUserRecord(userId, {
      expand: 'stories,regular_users_stories',
    });
    setProfileData(record);
    return record;
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditData(buildEditStateFromProfile(profileData, pbRef.current));
    }
    setIsEditing(!isEditing);
  }
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

      await updateUserRecord(editData.id, formData);
      await loadProfile(editData.id);
      alert("تم حفظ التغييرات بنجاح!");
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
  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountSave = async (e) => {
    e.preventDefault();

    if (!profileData || !pbRef.current?.authStore?.token) {
      setAccountFeedback({ type: 'error', text: 'الجلسة الحالية غير متاحة. سجّل الدخول مرة أخرى.' });
      return;
    }

    if (!accountData.username.trim()) {
      setAccountFeedback({ type: 'error', text: 'أدخل اسم المستخدم أولًا.' });
      return;
    }

    if (!accountData.email.trim()) {
      setAccountFeedback({ type: 'error', text: 'أدخل البريد الإلكتروني أولًا.' });
      return;
    }

    if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
      setAccountFeedback({ type: 'error', text: 'تأكيد كلمة المرور غير مطابق.' });
      return;
    }

    if (accountData.newPassword && !accountData.currentPassword) {
      setAccountFeedback({ type: 'error', text: 'أدخل كلمة المرور الحالية قبل حفظ الجديدة.' });
      return;
    }

    setIsSavingAccount(true);
    setAccountFeedback(null);

    try {
      const accountPayload = {
        username: accountData.username.trim(),
        email: accountData.email.trim(),
      };

      if (accountData.newPassword) {
        accountPayload.oldPassword = accountData.currentPassword;
        accountPayload.password = accountData.newPassword;
        accountPayload.passwordConfirm = accountData.confirmPassword;
      }

      const updatedProfile = await updateUserRecord(profileData.id, accountPayload);

      const data = { message: 'تم تحديث بيانات الدخول بنجاح.' };


      if (false) {
        throw new Error(data?.message || 'تعذر تحديث بيانات الدخول الآن.');
      }


      const latestProfile = {
        ...profileData,
        ...updatedProfile,
        expand: profileData.expand,
      };
      setProfileData(latestProfile);
      setAccountData(buildAccountStateFromProfile(latestProfile));
      setAccountFeedback({
        type: 'success',
        text: data?.message || 'تم تحديث بيانات الدخول بنجاح.',
      });
    } catch (error) {
      console.error('Failed to save account settings:', error);
      setAccountFeedback({
        type: 'error',
        text: error.message || 'تعذر تحديث بيانات الدخول الآن.',
      });
    } finally {
      setIsSavingAccount(false);
    }
  };

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
    setCode('+20');
    setAddLinkModalOpen(true);
  };
  const handleSaveNewLink = () => {
    const trimmedUrl = newLink.url?.trim();
    if (!trimmedUrl) return;

    const normalizedUrl = newLink.type === 'telegram' || newLink.type === 'whatsapp'
      ? `${code}${trimmedUrl}`
      : trimmedUrl;

    setEditData(p => ({ ...p, links: [...p.links, { ...newLink, url: normalizedUrl }] }));
    setAddLinkModalOpen(false);
  };

  const handleOpenStoryModal = (story, index) => {
    const matchedPreset = PRESET_STORY_IMAGES.find(preset => preset.src === story.img);
    setOpenPresetCategory(matchedPreset?.category || PRESET_STORY_IMAGES[0]?.category || '');
    setEditingStory({ ...story, index, presetKey: matchedPreset?.id || '' });
  };
  const handleSelectPresetStoryImage = async (preset) => {
    try {
      const response = await fetch(preset.src);
      const blob = await response.blob();
      const presetFile = new File([blob], `${preset.id}.svg`, {
        type: blob.type || 'image/svg+xml',
      });

      setEditingStory(p => ({
        ...p,
        presetKey: preset.id,
        newImageFile: presetFile,
        img: preset.src,
      }));
    } catch (error) {
      console.error('فشل تحميل الصورة الجاهزة:', error);
      alert('تعذر تحميل الصورة الجاهزة الآن. حاول مرة أخرى.');
    }
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
    setEditingStory(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleRemoveStory = async (storyId, indexToRemove) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه القصة؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }
    const originalStories = [...editData.stories];
    const updatedStories = originalStories.filter((_, i) => i !== indexToRemove);

    setEditData(p => ({ ...p, stories: updatedStories }));

    try {
      const targetCollection = originalStories[indexToRemove]?.collectionName;
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
        presetKey: '',
        newImageFile: compressedFile,
        img: URL.createObjectURL(compressedFile)
      }));

    } catch (error) {
      console.error('حدث خطأ أثناء ضغط صورة القصة:', error);
      setEditingStory(p => ({
        ...p,
        presetKey: '',
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
  const userData = isEditing && activeTab === 'profile'
    ? editData
    : buildEditStateFromProfile(profileData, pbRef.current);

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
  const editableSocialLinks = (editData?.links || []).map((link, index) => ({ link, index }))
    .filter(({ link }) => link.url && linkStyles[link.type] && !PRIMARY_CONTACT_TYPES.includes(link.type));
  const storyCount = userData.stories?.length || 0;
  const visitsCount = Number(profileData?.visits || 0);
  const presetStoryGroups = PRESET_STORY_IMAGES.reduce((groups, preset) => {
    if (!groups[preset.category]) {
      groups[preset.category] = [];
    }
    groups[preset.category].push(preset);
    return groups;
  }, {});
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
            <div className="dashboardTabs" role="tablist" aria-label="لوحة التحكم">
              <button
                type="button"
                className={`dashboardTabButton ${activeTab === 'profile' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                بيانات البطاقة
              </button>
              <button
                type="button"
                className={`dashboardTabButton ${activeTab === 'account' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                بيانات الدخول والإحصائيات
              </button>
            </div>
            <div hidden={activeTab !== 'profile'}>
              {isEditing && (
                <div className="editGuide">
                  <div className="editGuideHeader">
                    <span className="editModeBadge">وضع التعديل</span>
                    <h2>عدّل بيانات بطاقتك بسهولة</h2>
                    <p>
                      عدّل البيانات الأساسية أولًا، ثم حدّث وسائل التواصل، وبعدها أضف
                      أعمالك واضغط حفظ.
                    </p>
                  </div>
                  <div className="editGuideSteps">
                    {EDIT_STEPS.map((step) => (
                      <div key={step.title} className="editGuideStep">
                        <strong>{step.title}</strong>
                        <span>{step.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                {isEditing && (
                  <p className="editInlineHint">اضغط على الصورة لتغيير صورة الملف الشخصي.</p>
                )}
                {isEditing ? (
                  <div className='editingInput editSectionCard'>
                    <div className="editSectionHeader">
                      <h3>البيانات الأساسية</h3>
                      <p>هذه المعلومات تظهر أعلى البطاقة وتعرّف العميل بك بسرعة.</p>
                    </div>
                    <div className="editFieldGroup">
                      <label htmlFor="edit-name">الاسم الظاهر</label>
                      <input id="edit-name" type="text" name="name" value={editData.name} onChange={handleInputChange} className="textInput" placeholder="الاسم" />
                      <span className="fieldHint">اكتب الاسم الذي تريد أن يظهر أعلى البطاقة.</span>
                    </div>
                    <div className="editFieldGroup">
                      <label htmlFor="edit-job">المسمى الوظيفي</label>
                      <input id="edit-job" type="text" name="job" value={editData.job} onChange={handleInputChange} className="textInput compactInput" placeholder="الوظيفة" />
                      <span className="fieldHint">سطر قصير يشرح مجال عملك أو تخصصك.</span>
                    </div>
                    <div className="editFieldGroup">
                      <label>النبذة التعريفية</label>
                      <span className="fieldHint">يمكنك كتابة نبذة مختصرة أو نقاط سريعة عنك وعن خدماتك.</span>
                      <div className="editorShell">
                        <Editor value={editData.bio}
                          onTextChange={(e) => setEditData(prev => ({ ...prev, bio: e.htmlValue }))}
                          headerTemplate={header}
                          maxLength={500}
                          style={{
                            height: '320px',
                            textDecoration: 'rtl',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='nameHolder'>
                      <h1 className='text-2xl font-bold'>{userData.name}</h1>
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
                <div className="editSectionCard">
                  <div className="editSectionHeader editSectionHeaderSplit">
                    <div>
                      <h3>روابط التواصل والمنصات</h3>
                      <p>أضف المنصات التي تريد إظهارها، ويمكنك حذف أي منصة من زر الحذف فوقها.</p>
                    </div>
                    <button onClick={handleOpenAddLinkModal} className="inlineAddButton">
                      <Plus size={18} /> إضافة رابط
                    </button>
                  </div>
                  <div className="editStatsRow">
                    <span className="editStatPill">عدد الروابط الحالية: {editableSocialLinks.length}</span>
                  </div>
                  <ul className="list-group list-group-flush social-icons-list">
                    {editableSocialLinks
                      .map(({ link, index }) => {
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
                  </ul>
                </div>
              ) : (
                <ul className="list-group list-group-flush social-icons-list">
                  {userData.links
                    .filter(link => link.url && linkStyles.hasOwnProperty(link.type) && !PRIMARY_CONTACT_TYPES.includes(link.type))
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

              <div className={`stories d-flex align-items-center flex-column ${isEditing ? 'editSectionCard storiesSection' : ''}`}>
                <div className='stories p-4 space-y-4 w-100'>
                  <div className={isEditing ? 'editSectionHeader editSectionHeaderSplit' : ''}>
                    <div>
                      <h3 className="text-center font-bold text-lg border-b pb-2 mb-2">أعمالنا</h3>
                      {isEditing && (
                        <p className="storiesHint">أضف أعمالك مع صورة وعنوان ورابط حتى يطّلع العميل عليها بسهولة.</p>
                      )}
                    </div>
                    {isEditing && (
                      <button onClick={() => handleOpenStoryModal({ name: '', description: '', img: '' }, -1)} className="addStoryBtn">
                        <Plus size={20} /> إضافة عمل جديد
                      </button>
                    )}
                  </div>
                  {isEditing && (
                    <div className="editStatsRow">
                      <span className="editStatPill">عدد الأعمال الحالية: {storyCount}</span>
                    </div>
                  )}
                  <div className="storyCardsGrid">
                    {isEditing ?
                      userData.stories.map((story, index) => (
                        <div key={index} className="storyGridItem">
                          <Story key={index} discStory={story.description} linkTo={story.link} storyTittle={story.name}
                            editbtn={true} doThis={() => handleOpenStoryModal(story, index)}
                            deleteBtn={<button onClick={() =>
                              handleRemoveStory(story.id, index)} className="deletStory"> <MdDeleteForever /> حذف العمل </button>}
                            imgStory={story.img || 'https://placehold.co/100x100/EFEFEF/333333?text=?'} />
                        </div>
                      )) : userData.stories.map((story, index) => (
                        <div key={index} className="storyGridItem">
                          <Story key={index} discStory={story.description} linkTo={story.link}
                            storyTittle={story.name} editbtn={false}
                            imgStory={story.img || 'https://placehold.co/100x100/EFEFEF/333333?text=?'} />
                        </div>
                      ))
                    }
                  </div>
                  {isEditing && storyCount === 0 && (
                    <div className="emptyEditState">
                      لا توجد أعمال مضافة الآن. أضف أول عمل ليظهر للعميل داخل البطاقة.
                    </div>
                  )}
                </div>

              </div>
              {isEditing ?
                <div className="editSectionCard primaryContactSection">
                  <div className="editSectionHeader">
                    <h3>معلومات التواصل الأساسية</h3>
                    <p>هذه البيانات تظهر كوسيلة اتصال مباشرة للعميل داخل البطاقة.</p>
                  </div>
                  <div className="primaryContactGrid">
                    <div className="primaryContactItem">
                      <label>رقم الهاتف الأساسي</label>
                      <Call telNo={phoneNumber} editMode={true}
                        func={(e) => handlePrimaryLinkChange('phone', e.target.value)}
                        editData={editData?.links?.find(l => l.type === 'phone')?.url || ''} />
                      <span className="fieldHint">يفضّل كتابة الرقم كاملًا مع مفتاح الدولة.</span>
                    </div>
                    <div className="primaryContactItem">
                      <label>البريد الإلكتروني الأساسي</label>
                      <span className="call gmail" id='whatsapp'>
                        <img src={ICON_ASSETS.email.src} alt='whatsapp' />
                        <input
                          type="email"
                          name="email"
                          className="emailInput"
                          placeholder="البريد الإلكتروني الأساسي"
                          value={editData?.links?.find(l => l.type === 'email')?.url || ''}
                          onChange={(e) => handlePrimaryLinkChange('email', e.target.value)}
                        />
                      </span>
                      <span className="fieldHint">سيظهر كزر بريد مباشر داخل البطاقة.</span>
                    </div>
                  </div>
                </div>
                : <>
                  <Call telNo={phoneNumber} className="call gmail" />
                  <span className="call gmail" id='whatsapp'>
                    <img src={ICON_ASSETS.email.src} alt='whatsapp' />
                    <p>Mail:
                      <a href={`mailto:${userData ? emailAddress
                        : 'example@gmail.com'}`}>{userData ? emailAddress : 'example@gmail.com'}</a></p>
                  </span>
                </>
              }

              {isEditing ? (
                <div className='btnsEditor editActionsPanel'>
                  <p className="editActionsHint">بعد الانتهاء من المراجعة اضغط حفظ لتطبيق التغييرات على البطاقة.</p>
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
            <div hidden={activeTab !== 'account'}>
              <div className='userData'>
                <div className='imgHolder'>
                  <img src={userData.avatar || '/logo.png'} className="card-img-top" alt={userData.name} />
                </div>
                <div className='editingInput editSectionCard dashboardSummaryCard'>
                  <div className="editSectionHeader">
                    <h3>بيانات الدخول والإحصائيات</h3>
                    <p>من هنا تقدر تعدّل البريد أو كلمة المرور وتتابع عدد الزيارات القادم من الباك اند.</p>
                  </div>
                  <div className="dashboardStatsGrid">
                    <div className="dashboardStatCard">
                      <span className="dashboardStatLabel">عدد زيارات البروفايل</span>
                      <strong>{visitsCount}</strong>
                      <p>القيمة مقروءة من الحقل <code>Users.visits</code>.</p>
                    </div>
                    <div className="dashboardStatCard">
                      <span className="dashboardStatLabel">البريد الحالي</span>
                      <strong>{profileData.email || 'غير محدد'}</strong>
                      <p>بعد الحفظ سيتم تحديث الجلسة بالبيانات الجديدة تلقائيًا.</p>
                    </div>
                  </div>
                </div>
              </div>

              <form className="editSectionCard accountSettingsForm" onSubmit={handleAccountSave}>
                <div className="editSectionHeader">
                  <h3>تعديل بيانات الدخول</h3>
                  <p>لتغيير كلمة المرور اكتب الحالية، ثم الجديدة وتأكيدها. ويمكنك تغيير البريد في نفس الخطوة.</p>
                </div>

                <div className="accountSettingsGrid">
                  <div className="editFieldGroup">
                    <label htmlFor="account-username">اسم المستخدم</label>
                    <input
                      id="account-username"
                      type="text"
                      name="username"
                      value={accountData.username}
                      onChange={handleAccountInputChange}
                      className="textInput compactInput"
                      placeholder="username"
                    />
                  </div>
                  <div className="editFieldGroup">
                    <label htmlFor="account-email">البريد الإلكتروني</label>
                    <input
                      id="account-email"
                      type="email"
                      name="email"
                      value={accountData.email}
                      onChange={handleAccountInputChange}
                      className="textInput compactInput"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="editFieldGroup">
                    <label htmlFor="account-current-password">كلمة المرور الحالية</label>
                    <input
                      id="account-current-password"
                      type="password"
                      name="currentPassword"
                      value={accountData.currentPassword}
                      onChange={handleAccountInputChange}
                      className="textInput compactInput"
                      placeholder="أدخل كلمة المرور الحالية"
                    />
                  </div>
                  <div className="editFieldGroup">
                    <label htmlFor="account-new-password">كلمة المرور الجديدة</label>
                    <input
                      id="account-new-password"
                      type="password"
                      name="newPassword"
                      value={accountData.newPassword}
                      onChange={handleAccountInputChange}
                      className="textInput compactInput"
                      placeholder="اتركها فارغة إذا لا تريد التغيير"
                    />
                  </div>
                  <div className="editFieldGroup">
                    <label htmlFor="account-confirm-password">تأكيد كلمة المرور الجديدة</label>
                    <input
                      id="account-confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={accountData.confirmPassword}
                      onChange={handleAccountInputChange}
                      className="textInput compactInput"
                      placeholder="أعد كتابة كلمة المرور الجديدة"
                    />
                  </div>
                </div>

                {accountFeedback && (
                  <div className={`accountFeedback accountFeedback-${accountFeedback.type}`}>
                    {accountFeedback.text}
                  </div>
                )}

                <div className='btnsEditor editActionsPanel'>
                  <p className="editActionsHint">لو غيّرت كلمة المرور سيتم تجديد الجلسة بعد الحفظ مباشرة.</p>
                  <div className="saveEdits">
                    <button type="submit" className="save" disabled={isSavingAccount}>
                      <Save size={18} /> {isSavingAccount ? 'جارٍ الحفظ...' : 'حفظ بيانات الدخول'}
                    </button>
                  </div>
                  <button type="button" onClick={handleLogout} className="login-submit">تسجيل الخروج <MdLogout size={20} /></button>
                </div>
              </form>
            </div>
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 addLinker modalSurface">
              <h2 className="text-2xl font-bold text-center">إضافة رابط جديد</h2>
              <p className="modalHelperText">
                اختر المنصة ثم أضف الرابط أو الرقم بالشكل المناسب ليظهر ضمن الأيقونات
                داخل البطاقة.
              </p>
              <div className='socialIconSelector modalFieldGroup'>
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
                    {MANAGED_SOCIAL_TYPES.map(type => (
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
              <div className='socialIconLink w-100 modalFieldGroup'>
                <label className="block text-sm font-medium text-gray-700">
                  {newLink.type === 'whatsapp'
                    ? 'رقم الواتساب'
                    : newLink.type === 'telegram'
                      ? 'بيانات تيليجرام'
                      : 'الرابط'}
                </label>
                {newLink.type === 'whatsapp' ?
                  <div className="linkInputRow">
                    <select id='code' value={code} onChange={e => setCode(e.target.value)}>
                      <option value="+20" >+20</option>
                      <option value="+971" >+971</option>
                      <option value="+966">+966</option>
                    </select>
                    <input type="text" value={newLink.url} onChange={e => {
                      let phone = e.target.value
                      setNewLink(p => ({ ...p, url: phone }))
                    }}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="اكتب رقم الواتساب" />
                  </div>
                  : newLink.type === 'telegram' ?
                    <div className="linkInputRow">
                      <select id='code' value={code} onChange={e => setCode(e.target.value)}>
                        <option value="+20" >+20</option>
                        <option value="+971" >+971</option>
                        <option value="+966">+966</option>
                      </select>
                      <input type="text" value={newLink.url} onChange={e => {
                        let phone = e.target.value
                        setNewLink(p => ({ ...p, url: phone }))
                      }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="اكتب رقم أو معرف تيليجرام" />
                    </div>
                    : <input type="url" value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="https://example.com" />
                }
              </div>
              <div className="flex justify-center gap-4 mt-4 modalActions">
                <button onClick={handleSaveNewLink} className="save">حفظ</button>
                <button onClick={() => setAddLinkModalOpen(false)} className="cancel">إلغاء</button>
              </div>
            </div>
          </div>
        )}
        {editingStory && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 editStoryHolder">
            <div className="bg-white w-full max-w-md space-y-4 p-5 modalSurface storyModalSurface">
              <h2 className="text-2xl font-bold text-center">{editingStory.index > -1 ? 'تعديل العمل' : 'إضافة عمل جديد'}</h2>
              <p className="modalHelperText">
                أضف عنوانًا واضحًا ووصفًا مختصرًا ورابطًا صحيحًا للعمل حتى يظهر بشكل
                احترافي للعميل.
              </p>

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

              <div className="presetStorySection">
                <div className="presetStoryHeader">
                  <h3>صور جاهزة للاستخدام</h3>
                  <p>اختر صورة مناسبة للنشاط مباشرة، أو ارفع صورة خاصة بك من الأعلى.</p>
                </div>
                <div className="presetStoryAccordion">
                  {Object.entries(presetStoryGroups).map(([category, presets]) => (
                    <div key={category} className="presetStoryGroup">
                      <button
                        type="button"
                        className={`presetStoryQuestion ${openPresetCategory === category ? 'active' : ''}`}
                        onClick={() => setOpenPresetCategory((current) => current === category ? '' : category)}
                        aria-expanded={openPresetCategory === category}
                      >
                        <span>{category}</span>
                        <span className="presetStoryToggle">{openPresetCategory === category ? '-' : '+'}</span>
                      </button>
                      {openPresetCategory === category ? (
                        <div className="presetStoryAnswer">
                          <div className="presetStoryGrid">
                            {presets.map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                className={`presetStoryCard ${editingStory?.presetKey === preset.id ? 'is-selected' : ''}`}
                                onClick={() => handleSelectPresetStoryImage(preset)}
                              >
                                <img src={preset.src} alt={preset.label} className="presetStoryThumb" />
                                <span className="presetStoryLabel">{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className='inputEditStory'>
                <div className="modalFieldGroup">
                  <label>اسم العمل</label>
                  <input type="text" name="name" value={editingStory.name} onChange={handleStoryInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md textInput" placeholder="مثال: تصميم هوية بصرية" />
                </div>
                <div className="modalFieldGroup">
                  <label>رابط العمل</label>
                  <input type="text" name="link" value={editingStory.link} onChange={handleStoryInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md textInput text-start" placeholder="https://example.com/project" />
                </div>
                <div className="modalFieldGroup">
                  <label>وصف مختصر</label>
                  <textarea name="description" value={editingStory.description} onChange={handleStoryInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md textareaInput" rows="3" placeholder="اشرح للعميل باختصار ماذا قدمت في هذا العمل."></textarea>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4 modalActions">
                <button onClick={handleSaveStory} className="save bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">حفظ</button>
                <button onClick={() => setEditingStory(null)} className="cancel bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {!isEditing && (
        <button onClick={handleEditToggle} className="fab-edit-button" title="تعديل">
          <Edit size={24} />
        </button>
      )}
    </>
  );
}

export default EditPage;
